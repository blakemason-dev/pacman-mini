import { Schema, type } from '@colyseus/schema';
import { sGameObject } from "./sGameObject";
import { sVector2 } from './sVector2';

export class sRock extends sGameObject {
    @type(sVector2)
    position: sVector2 = new sVector2();
}   