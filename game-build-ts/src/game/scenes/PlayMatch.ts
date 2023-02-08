import { MapSchema } from '@colyseus/schema';
import { 
    createWorld,
    IWorld,
    System,

} from 'bitecs';
import Phaser from 'phaser';
import { iServerGameConfig } from '../../../../game-server/src/types/iServerGameConfig';
import { GameObjectType, sGameObject } from '../../../../game-server/src/types/sGameObject';
import { sPacman } from '../../../../game-server/src/types/sPacman';
import { createPfGuiScore, destroyPfGuiScore } from '../ecs/prefabs/gui/pfGuiScore';
import { createPfServerCliffArea } from '../ecs/prefabs/network/pfServerCliffArea';
import { createPfServerMiniPacman, destroyPfServerMiniPacman } from '../ecs/prefabs/network/pfServerMiniPacman';
import { createPfServerPacman, destroyPfServerPacman } from '../ecs/prefabs/network/pfServerPacman';
import { createPfServerPortal, destroyPfServerPortal } from '../ecs/prefabs/network/pfServerPortal';
import { createPfServerWall, destroyPfServerWall } from '../ecs/prefabs/network/pfServerWall';
import { createPfMainCamera, destroyPfMainCamera } from '../ecs/prefabs/pfMainCamera';
import { createCircleSystem } from '../ecs/systems/CircleSystem';
import { createGuiScoreSystem } from '../ecs/systems/gui/GuiScoreSystem';
import { createGuiTextSystem } from '../ecs/systems/gui/GuiTextSystem';
import { createImageSystem } from '../ecs/systems/ImageSystem';
import { createMainCameraSystem } from '../ecs/systems/MainCameraSystem';
import { createServerGameObjectSyncSystem } from '../ecs/systems/network/ServerGameObjectSyncSystem';
import { createServerMiniPacmanControllerSystem } from '../ecs/systems/network/ServerMiniPacmanControllerSystem';
import { createSnapshotInterpolationSystem } from '../ecs/systems/SnapshotInterpolationSystem';
import { ClientInputHandler } from '../services/ClientInputHandler';

import { BootStrap } from './BootStrap';

let playerEid = -1;

const enum PrefabType {
    Pacman,
    MiniPacman,
    Wall,
    MainCamera,
    Portal,
    GuiScore
}

export class PlayMatch extends Phaser.Scene {
    private bootStrap!: BootStrap;
    private world!: IWorld;
    private systems: System[] = [];
    private clientInputHandler!: ClientInputHandler;

    private clientTime!: number;

    // private fpsText!: Phaser.GameObjects.Text;

    private entities: {eid: number, type: PrefabType}[] = [];

    constructor() {
        super("play-match");
        console.log('PlayMatch: constructor()');
    }

    init(data: any) {
        console.log('PlayMatch: init()');

        this.bootStrap = data.bootStrap;
    }

    preload() {
        console.log('PlayMatch: preload()');
    }

    async create(serverGameConfig: iServerGameConfig) {
        console.log('PlayMatch: create()');

        // this.fpsText = this.add.text(
        //     this.scale.width * 0.025,
        //     this.scale.width * 0.025,
        //     "Scene: PlayMatch\nFPS: 0",
        //     {
        //         fontFamily: 'arial',
        //         fontSize: '20px',
        //         color: '#ffffff'
        //     }
        // ).setOrigin(0, 0);
        // this.fpsText.setScrollFactor(0);

        // Create ECS world
        this.world = createWorld();

        let portalEid = -1;
        
        // Create entities based on server types in state
        this.bootStrap.server.room.state.gameObjects.forEach((go, eid) => {
            switch (go.type) {
                case GameObjectType.Pacman: {
                    if (go.sessionId === this.bootStrap.server.room.sessionId) {
                        playerEid = createPfServerPacman(this.world, parseInt(eid), go);
                        this.entities.push({eid: playerEid, type: PrefabType.Pacman})
                    } else {
                        const goEid = createPfServerPacman(this.world, parseInt(eid), go);
                        this.entities.push({eid: goEid, type: PrefabType.Pacman});
                    }
                    break;
                }
                case GameObjectType.MiniPacman: {
                    const goEid = createPfServerMiniPacman(this.world, parseInt(eid), go);
                    this.entities.push({eid: goEid, type: PrefabType.MiniPacman});
                    break;
                }
                case GameObjectType.Background: {
                    // createPfServerCliffArea(this.world, parseInt(eid), go);
                    break;
                }
                case GameObjectType.Wall: {
                    const goEid = createPfServerWall(this.world, parseInt(eid), go);
                    this.entities.push({eid: goEid, type: PrefabType.Wall})
                    break;
                }
                case GameObjectType.Portal: {
                    portalEid = createPfServerPortal(this.world, go, parseInt(eid));
                    this.entities.push({eid: portalEid, type: PrefabType.Portal});
                    break;
                }
                default: break;
            }
        });

        // create a camera entity and follow the player
        let eid = createPfMainCamera(this.world, playerEid);
        this.entities.push({eid: eid, type: PrefabType.MainCamera});

        // create scores
        eid = createPfGuiScore(this.world, 0xff0000, window.innerWidth/3, window.innerHeight*0.1);
        this.entities.push({eid: eid, type: PrefabType.GuiScore});
        eid = createPfGuiScore(this.world, 0x0000ff, window.innerWidth*2/3, window.innerHeight*0.1);
        this.entities.push({eid: eid, type: PrefabType.GuiScore});

        // Start listening for input
        this.clientInputHandler = new ClientInputHandler(this, this.bootStrap.server);
        this.clientInputHandler.startListening();

        // set our client time
        this.clientTime = serverGameConfig.timeStamp;

        // CREATE SYSTEMS
        // 1. server info systems
        this.systems.push(createServerGameObjectSyncSystem(this.bootStrap.server, this.world));

        // 2. input processing systems
        this.systems.push(createServerMiniPacmanControllerSystem(this.bootStrap.server, this.world, portalEid))

        // 3a. render interpolation systems
        this.systems.push(createSnapshotInterpolationSystem(this.bootStrap.server, serverGameConfig, this.world));

        // 3b. render systems
        this.systems.push(createImageSystem(this, serverGameConfig));
        this.systems.push(createCircleSystem(this, serverGameConfig));
        this.systems.push(createMainCameraSystem(this, serverGameConfig));

        // 4. GUI
        this.systems.push(createGuiTextSystem(this));
        this.systems.push(createGuiScoreSystem(this, this.world, this.bootStrap.server));
    
        // EVENTS to listen for
        this.bootStrap.server.events.on('all-mini-pacmen-saved', (winnerPacman: sPacman) => {
            const mySessionId = this.bootStrap.server.room.sessionId;
            const winnerColor = winnerPacman.color === 0xff0000 ? "#ff0000" : "#0000ff";
            const loserColor = winnerPacman.color === 0xff0000 ? "#0000ff" : "#ff0000";
            let gameOverText;
            if (winnerPacman.sessionId === mySessionId) {
                console.log('you win!');
                gameOverText = this.add.text(
                    window.innerWidth/2, 
                    window.innerHeight/2,
                    'YOU WIN!!!!',
                    {
                        fontFamily: 'Arial',
                        fontSize: '48px',
                        color: winnerColor
                    });
            } else {
                console.log('you lose...');
                gameOverText = this.add.text(
                    window.innerWidth/2, 
                    window.innerHeight/2,
                    'YOU LOSE...',
                    {
                        fontFamily: 'Arial',
                        fontSize: '48px',
                        color: loserColor
                    });
            }
            gameOverText.setOrigin(0.5, 0.5);
            gameOverText.setDepth(100);
            // gameOverText.setScrollFactor(0.4);
            
            setTimeout(() => {
                // ensure all listeners in this scene are removed
                this.bootStrap.server.events.removeAllListeners('all-mini-pacmen-saved');
                this.destroy();
                this.bootStrap.server.room.leave();
                this.bootStrap.switch('play-match', 'find-match');
            }, 3000)
        });
    
    }

    private accum = 0;

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.systems.map(system => {
            system(this.world);
        });

        // update fps
        this.accum += dt;
        if (this.accum > 200) {
            // this.fpsText.text = "Scene: PlayMatch\nFPS: " + (1000 / dt).toFixed(1);
            this.accum = 0;
        }
    }

    destroy() {
        // destroy entities based on server types in state
        this.entities.map(ent => {
            switch (ent.type) {
                case PrefabType.Pacman: {
                    destroyPfServerPacman(this.world, ent.eid);
                    break;
                }
                case PrefabType.MiniPacman: {
                    destroyPfServerMiniPacman(this.world, ent.eid);
                    break;
                }
                // case PrefabType.Background: {
                //     // createPfServerCliffArea(this.world, parseInt(eid), go);
                //     break;
                // }
                case PrefabType.Wall: {
                    destroyPfServerWall(this.world, ent.eid);
                    break;
                }
                case PrefabType.Portal: {
                    destroyPfServerPortal(this.world, ent.eid);
                    break;
                }
                case PrefabType.MainCamera: {
                    destroyPfMainCamera(this.world, ent.eid);
                    break;
                }
                case PrefabType.GuiScore: {
                    destroyPfGuiScore(this.world, ent.eid);
                    break;
                }
                default: break;
            }
        });
    }
}