import { Schema, type } from '@colyseus/schema';
import { GameObjectType, sGameObject } from "./sGameObject";
import { sVector2 } from './sVector2';

export class sBackground extends sGameObject {
    @type(sVector2)
    position: sVector2 = new sVector2();

    @type('string')
    texture = "";

    constructor() {
        super();
        this.type = GameObjectType.Background;
    }
}   