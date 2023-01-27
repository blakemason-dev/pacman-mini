// FindMatch.ts
// - Is the first scene called when BootStrap is created
// - Think of it as the Main Menu of a game

import Phaser from 'phaser';

import { BootStrap } from './BootStrap';

import { 
    createWorld,
    IWorld,
    removeEntity,
    System
} from 'bitecs';

import EventEmitter from 'events';
import { createPfGuiFindMatchButton } from '../ecs/prefabs/gui/pfGuiFindMatchButton';
import { GuiTransform } from '../ecs/components/gui/GuiTransform';
import { createGuiRectangleSystem } from '../ecs/systems/gui/GuiRectangleSystem';
import { createGuiTextSystem } from '../ecs/systems/gui/GuiTextSystem';

export class FindMatch extends Phaser.Scene {
    private world!: IWorld;
    private guiRectangleSystem!: System;
    private guiTextSystem!: System;

    private sceneText!: Phaser.GameObjects.Text;

    private bootStrap!: BootStrap;

    private switchScene = false;

    private eventEmitter!: EventEmitter;

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
    }

    create() {
        console.log('FindMatch: create()');

        this.eventEmitter = new EventEmitter();

        this.sceneText = this.add.text(
            this.scale.width*0.025,
            this.scale.width*0.025,
            "Scene: FindMatch",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0,0);

        // create ECS world
        this.world = createWorld();

        // create find match button
        const eidFindMatchButton = createPfGuiFindMatchButton(this.world);
        GuiTransform.position.x[eidFindMatchButton] = this.scale.width*0.5;
        GuiTransform.position.y[eidFindMatchButton] = this.scale.height*0.5;
        this.eventEmitter.on('GuiRectangle-POINTER_UP', (eid) => {
            if (eid === eidFindMatchButton) {
                this.sceneText.destroy();
                removeEntity(this.world, eidFindMatchButton);
                this.switchScene = true;
                this.eventEmitter.removeAllListeners();
            }
        });
        
        // create systems
        this.guiRectangleSystem = createGuiRectangleSystem(this, this.eventEmitter);
        this.guiTextSystem = createGuiTextSystem(this);
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.guiRectangleSystem(this.world);
        this.guiTextSystem(this.world);

        // if we got a switchscene message at some stage, change scenes
        if (this.switchScene) {
            this.bootStrap.switch('find-match', 'search-match');
        }
    }
}