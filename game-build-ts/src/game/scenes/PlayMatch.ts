import Phaser from 'phaser';

import { BootStrap } from './BootStrap';

export class PlayMatch extends Phaser.Scene {
    private bootStrap!: BootStrap;

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
    }

    update(t: number, dt: number) {

    }
}