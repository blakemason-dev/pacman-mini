import { 
    createWorld,
    IWorld,
    System,

} from 'bitecs';
import Phaser from 'phaser';
import { GameObjectType } from '../../../../game-server/src/types/sGameObject';
import { createPfServerCliffArea } from '../ecs/prefabs/network/pfServerCliffArea';
import { createPfServerPacman } from '../ecs/prefabs/network/pfServerPacman';
import { createPfServerWall } from '../ecs/prefabs/network/pfServerWall';
import { createPfMainCamera } from '../ecs/prefabs/pfMainCamera';
import { createImageSystem } from '../ecs/systems/ImageSystem';
import { createMainCameraSystem } from '../ecs/systems/MainCameraSystem';
import { createServerGameObjectSyncSystem } from '../ecs/systems/network/ServerGameObjectSyncSystem';
import { createTransformRenderInterpolatorSystem } from '../ecs/systems/TransformRenderInterpolatorSystem';
import { ClientInputHandler } from '../services/ClientInputHandler';

import { BootStrap } from './BootStrap';

export class PlayMatch extends Phaser.Scene {
    private bootStrap!: BootStrap;
    private world!: IWorld;
    private systems: System[] = [];
    private clientInputHandler!: ClientInputHandler;

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

    async create(serverGameConfig: any) {
        console.log('PlayMatch: create()');

        // this.add.text(
        //     this.scale.width * 0.025,
        //     this.scale.width * 0.025,
        //     "Scene: PlayMatch",
        //     {
        //         fontFamily: 'arial',
        //         fontSize: '20px',
        //         color: '#ffffff'
        //     }
        // ).setOrigin(0, 0);

        // Create ECS world
        this.world = createWorld();

        let playerEid = -1;

        // Create entities based on server game objects
        this.bootStrap.server.room.state.gameObjects.forEach((go, eid) => {
            switch (go.type) {
                case GameObjectType.Pacman: {
                    playerEid = createPfServerPacman(this.world, parseInt(eid));
                    break;
                }
                case GameObjectType.Background: {
                    // createPfServerCliffArea(this.world, parseInt(eid), go);
                    break;
                }
                case GameObjectType.Wall: {
                    createPfServerWall(this.world, parseInt(eid), go);
                }
                default: break;
            }
        });

        // create a camera entity and follow the player
        createPfMainCamera(this.world, playerEid);

        // Start listening for input
        this.clientInputHandler = new ClientInputHandler(this, this.bootStrap.server);
        this.clientInputHandler.startListening();

        // Create systems
        this.systems.push(createServerGameObjectSyncSystem(this.bootStrap.server));
        this.systems.push(createTransformRenderInterpolatorSystem(this.bootStrap.server, serverGameConfig));
        this.systems.push(createImageSystem(this, serverGameConfig));
        this.systems.push(createMainCameraSystem(this, serverGameConfig));
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.systems.map(system => {
            system(this.world);
        });
    }
}