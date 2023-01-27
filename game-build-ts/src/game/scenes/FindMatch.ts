// FindMatch.ts
// - Is the first scene called when BootStrap is created
// - Think of it as the Main Menu of a game

import Phaser from 'phaser';

import { BootStrap } from './BootStrap';

import mysteryBox from '../assets/mystery-box.png';

export class FindMatch extends Phaser.Scene {

    private bootStrap!: BootStrap;

    constructor() {
        super("find-match");
        console.log('FindMatch: constructor()');
    }

    init(data: any) {
        console.log('FindMatch: init()');

        this.bootStrap = data.bootStrap;
    }
    
    preload() {
        console.log('FindMatch: preload()');

        this.load.image('box', mysteryBox);
    }

    create() {
        console.log('FindMatch: create()');

        this.add.image(100,100, 'box')
            .setDisplaySize(64,64);

        alert(document.getElementById('app')?.innerHTML);
    }

    update(t: number, dt: number) {

    }
}