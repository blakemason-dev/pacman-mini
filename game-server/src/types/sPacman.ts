import { Schema, type } from '@colyseus/schema';
import { GameObjectType, sGameObject } from "./sGameObject";
import { sVector2 } from './sVector2';

export class sPacman extends sGameObject {
    @type(sVector2)
    position: sVector2 = new sVector2(0, 0);

    @type('number')
    angle: number = 0;

    @type('number')
    radius: number = 0.5;

    @type('number')
    color: number = 0x0000ff;

    constructor(sessionId: string, x: number = 0, y: number = 0) {
        super(GameObjectType.Pacman, sessionId);
        this.position.x = x;
        this.position.y = y;
    }
}   