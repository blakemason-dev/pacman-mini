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

    constructor(sessionId: string) {
        super(GameObjectType.Pacman, sessionId);
    }
}   