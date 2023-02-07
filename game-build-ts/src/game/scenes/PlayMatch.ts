import { MapSchema } from '@colyseus/schema';
import { 
    createWorld,
    IWorld,
    System,

} from 'bitecs';
import Phaser from 'phaser';
import { iServerGameConfig } from '../../../../game-server/src/types/iServerGameConfig';
import { GameObjectType, sGameObject } from '../../../../game-server/src/types/sGameObject';
import { createPfGuiScore } from '../ecs/prefabs/gui/pfGuiScore';
import { createPfServerCliffArea } from '../ecs/prefabs/network/pfServerCliffArea';
import { createPfServerMiniPacman } from '../ecs/prefabs/network/pfServerMiniPacman';
import { createPfServerPacman } from '../ecs/prefabs/network/pfServerPacman';
import { createPfServerPortal } from '../ecs/prefabs/network/pfServerPortal';
import { createPfServerWall } from '../ecs/prefabs/network/pfServerWall';
import { createPfMainCamera } from '../ecs/prefabs/pfMainCamera';
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

export class PlayMatch extends Phaser.Scene {
    private bootStrap!: BootStrap;
    private world!: IWorld;
    private systems: System[] = [];
    private clientInputHandler!: ClientInputHandler;

    private clientTime!: number;

    private fpsText!: Phaser.GameObjects.Text;

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

        this.fpsText = this.add.text(
            this.scale.width * 0.025,
            this.scale.width * 0.025,
            "Scene: PlayMatch\nFPS: 0",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0, 0);
        this.fpsText.setScrollFactor(0);

        // Create ECS world
        this.world = createWorld();

        let portalEid = -1;
        
        // Create entities based on server types in state
        this.bootStrap.server.room.state.gameObjects.forEach((go, eid) => {
            switch (go.type) {
                case GameObjectType.Pacman: {
                    let finalEid = -1;
                    if (go.sessionId === this.bootStrap.server.room.sessionId) {
                        playerEid = createPfServerPacman(this.world, parseInt(eid), go);
                        finalEid = playerEid;
                    } else {
                        finalEid = createPfServerPacman(this.world, parseInt(eid), go);
                    }
                    break;
                }
                case GameObjectType.MiniPacman: {
                    createPfServerMiniPacman(this.world, parseInt(eid), go);
                    break;
                }
                case GameObjectType.Background: {
                    // createPfServerCliffArea(this.world, parseInt(eid), go);
                    break;
                }
                case GameObjectType.Wall: {
                    createPfServerWall(this.world, parseInt(eid), go);
                    break;
                }
                case GameObjectType.Portal: {
                    portalEid = createPfServerPortal(this.world, go, parseInt(eid));
                    break;
                }
                default: break;
            }
        });

        // create a camera entity and follow the player
        createPfMainCamera(this.world, playerEid);

        // create scores
        createPfGuiScore(this.world, 0xff0000, window.innerWidth/3, window.innerHeight*0.1);
        createPfGuiScore(this.world, 0x0000ff, window.innerWidth*2/3, window.innerHeight*0.1);

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
            this.fpsText.text = "Scene: PlayMatch\nFPS: " + (1000 / dt).toFixed(1);
            this.accum = 0;
        }
    }
}