// SearchMatch.ts
// - Used to 

import Phaser from 'phaser';

import { BootStrap } from './BootStrap';

export class SearchMatch extends Phaser.Scene {
    private bootStrap!: BootStrap;

    private sceneText!: Phaser.GameObjects.Text;

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

        this.sceneText = this.add.text(
            this.scale.width * 0.025,
            this.scale.width * 0.025,
            "Scene: SearchMatch",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0, 0);

        // join the server
        this.bootStrap.server.join();

        // once we get a match started message, we can switch scenes
        this.bootStrap.server.events.on('start-match', (serverGameConfig) => {
            console.log('SearchMath: Starting Match')
            this.sceneText.destroy();
            this.bootStrap.switch('search-match', 'play-match', serverGameConfig);
        });
    }
}