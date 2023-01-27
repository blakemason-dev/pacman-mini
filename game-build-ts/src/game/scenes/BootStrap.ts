// Bootstrap.ts
// - Handles scene management and global assets
// - Is live during entire duration of a game instance

import Phaser from "phaser";

// import * as AssetLibrary from '../libraries/AssetLibrary';
import GameServerHandler from "../services/GameServerHandler";
import { EndMatch } from "./EndMatch";
import { FindMatch } from "./FindMatch";
import { PlayMatch } from "./PlayMatch";
import { SearchMatch } from "./SearchMatch";

export class BootStrap extends Phaser.Scene {
    server!: GameServerHandler;

    constructor() {
        super('boot-strap');
        console.log('BootStrap: constructor()');
    }

    init() {
        console.log('BootStrap: init()');
    }

    preload() {
        console.log('BootStrap: preload()');

        // load all assets for global use
        // AssetLibrary.loadAll(this);
    }

    create() {
        console.log('Bootstrap: create()');

        // connect to the server
        this.server = new GameServerHandler();
        
        // switch to the find match scene
        this.switch("", "find-match");
    }

    switch(oldScene: string, newScene: string, data: any = {}) {
        // remove the old scene if it exists
        if (this.scene.get(oldScene)) {
            this.scene.remove(oldScene);
        }

        // add the new scene
        if (!this.scene.get(newScene)) {
            switch (newScene) {
                case 'find-match': { 
                    this.scene.add(
                        newScene,
                        FindMatch, 
                        true,
                        { bootStrap: this, ...data }
                    );
                    break;
                }
                case 'search-match': { 
                    this.scene.add(
                        newScene,
                        SearchMatch, 
                        true,
                        { bootStrap: this, ...data }
                    );
                    break;
                }
                case 'play-match': { 
                    this.scene.add(
                        newScene,
                        PlayMatch, 
                        true,
                        { bootStrap: this, ...data }
                    );
                    break;
                }
                case 'end-match': { 
                    this.scene.add(
                        newScene,
                        EndMatch, 
                        true,
                        { bootStrap: this, ...data }
                    );
                    break;
                }
                default: break;
            }
        }
    }
}