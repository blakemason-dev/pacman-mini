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

    @type('number')
    color: number = 0xffcc00;

    @type('number')
    serverEid: number = -1;

    constructor(serverEid: number, x: number = 0, y: number = 0) {
        super(GameObjectType.MiniPacman);
        this.position.x = x;
        this.position.y = y;
        this.serverEid = serverEid;
    }
}   