import Phaser from 'phaser';
import { BootStrap } from './BootStrap';

export class EndMatch extends Phaser.Scene {

    private bootStrap!: BootStrap;

    constructor() {
        super("end-match");
        console.log('EndMatch: constructor()');
    }

    init(data: any) {
        console.log('EndMatch: init()');

        this.bootStrap = data.bootStrap;
    }

    preload() {
        console.log('EndMatch: preload()');
    }

    create(data: any) {
        console.log('EndMatch: create()');
    }

    update(t: number, dt: number) {

    }
}