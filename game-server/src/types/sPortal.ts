import { Schema, type } from '@colyseus/schema';
import { GameObjectType, sGameObject } from "./sGameObject";
import { sVector2 } from './sVector2';

export class sPortal extends sGameObject {
    @type(sVector2)
    position: sVector2 = new sVector2();

    @type('number')
    radius = 1.5;

    constructor(x: number, y: number, radius: number = 1.5) {
        super();
        this.type = GameObjectType.Portal;
        this.position.x = x;
        this.position.y = y;
        this.radius = radius;
    }
}   