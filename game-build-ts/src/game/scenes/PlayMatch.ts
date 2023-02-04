import { MapSchema } from '@colyseus/schema';
import { 
    createWorld,
    IWorld,
    System,

} from 'bitecs';
import Phaser from 'phaser';
import { iServerGameConfig } from '../../../../game-server/src/types/iServerGameConfig';
import { GameObjectType, sGameObject } from '../../../../game-server/src/types/sGameObject';
import { TransformRenderInterpolator } from '../ecs/components/TransformRenderInterpolator';
import { createPfServerCliffArea } from '../ecs/prefabs/network/pfServerCliffArea';
import { createPfServerMiniPacman } from '../ecs/prefabs/network/pfServerMiniPacman';
import { createPfServerPacman } from '../ecs/prefabs/network/pfServerPacman';
import { createPfServerPortal } from '../ecs/prefabs/network/pfServerPortal';
import { createPfServerWall } from '../ecs/prefabs/network/pfServerWall';
import { createPfMainCamera } from '../ecs/prefabs/pfMainCamera';
import { createCircleSystem } from '../ecs/systems/CircleSystem';
import { createImageSystem } from '../ecs/systems/ImageSystem';
import { createMainCameraSystem } from '../ecs/systems/MainCameraSystem';
import { createServerGameObjectSyncSystem } from '../ecs/systems/network/ServerGameObjectSyncSystem';
import { createTransformRenderInterpolatorSystem } from '../ecs/systems/TransformRenderInterpolatorSystem';
import { createTRIv2System } from '../ecs/systems/TRIv2System';
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

        // let playerEid = -1;

        this.bootStrap.server.room.state.gameObjects.forEach((go, eid) => {
            switch (go.type) {
                case GameObjectType.Pacman: {
                    if (go.sessionId === this.bootStrap.server.room.sessionId) {
                        playerEid = createPfServerPacman(this.world, parseInt(eid), go);
                    } else {
                        createPfServerPacman(this.world, parseInt(eid), go);
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
                    createPfServerPortal(this.world, go, parseInt(eid));
                    break;
                }
                default: break;
            }
        });

        // create a camera entity and follow the player
        createPfMainCamera(this.world, playerEid);

        // Start listening for input
        this.clientInputHandler = new ClientInputHandler(this, this.bootStrap.server);
        this.clientInputHandler.startListening();

        // set our client time
        this.clientTime = serverGameConfig.timeStamp;

        // Create systems
        this.systems.push(createServerGameObjectSyncSystem(this.bootStrap.server, this.world));
        this.systems.push(createTransformRenderInterpolatorSystem(this.bootStrap.server, serverGameConfig, this.world));
        this.systems.push(createTRIv2System(this.bootStrap.server, serverGameConfig, this.world));
        this.systems.push(createImageSystem(this, serverGameConfig));
        this.systems.push(createCircleSystem(this, serverGameConfig));
        this.systems.push(createMainCameraSystem(this, serverGameConfig));
    }

    private accum = 0;

    update(t: number, dt: number) {
        if (!this.world) return;

        // update client time
        // this.clientTime += dt;

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

        // console.log(TransformRenderInterpolator.interp.position.x[playerEid].toFixed(3), TransformRenderInterpolator.interp.position.y[playerEid].toFixed(3));
    }
}