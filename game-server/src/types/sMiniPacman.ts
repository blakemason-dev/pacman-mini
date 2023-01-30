import { Schema, type } from '@colyseus/schema';
import { GameObjectType, sGameObject } from "./sGameObject";
import { sVector2 } from './sVector2';

export class sMiniPacman extends sGameObject {
    @type(sVector2)
    position: sVector2 = new sVector2();

    @type('number')
    angle: number = 0;

    @type('number')
    radius: number = 0.25;

    constructor() {
        super(GameObjectType.MiniPacman);
    }
}   