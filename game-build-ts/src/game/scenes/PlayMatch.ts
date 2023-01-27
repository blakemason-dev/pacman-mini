import { 
    createWorld,
    IWorld,

} from 'bitecs';
import Phaser from 'phaser';
import { GameObjectType } from '../../../../game-server/src/types/sGameObject';
import { createPfServerPacman } from '../ecs/prefabs/network/pfServerPacman';

import { BootStrap } from './BootStrap';

export class PlayMatch extends Phaser.Scene {
    private bootStrap!: BootStrap;
    private world!: IWorld;

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

        this.add.text(
            this.scale.width * 0.025,
            this.scale.width * 0.025,
            "Scene: PlayMatch",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0, 0);

        // CREATE ECS WORLD
        this.world = createWorld();

        // CREATE ENTITIES BASED ON ROOM GAME OBJECTS
        this.bootStrap.server.room.state.gameObjects.forEach((go, eid) => {
            switch (go.type) {
                case GameObjectType.Pacman: {
                    createPfServerPacman(this.world, parseInt(eid));
                    break;
                }
                default: break;
            }
        });
    }

    update(t: number, dt: number) {

    }
}