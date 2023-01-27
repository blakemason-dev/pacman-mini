import Phaser from 'phaser';

import { BootStrap } from './BootStrap';

export class SearchMatch extends Phaser.Scene {
    private bootStrap!: BootStrap;

    constructor() {
        super("search-match");
        console.log('SearchMatch: constructor()');
    }

    init(data: any) {
        console.log('SearchMatch: init()');

        this.bootStrap = data.bootStrap;
    }

    preload() {
        console.log('SearchMatch: preload()');
    }

    create() {
        console.log('SearchMatch: create()');
    }
}