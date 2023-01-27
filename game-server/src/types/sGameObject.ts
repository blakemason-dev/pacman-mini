import { Schema, type } from '@colyseus/schema';

export enum GameObjectType {
    Pacman,
    MiniPacman,
    Rock,
    Background
}

export class sGameObject extends Schema {
    @type('number')
    type: number = -1;

    @type('string')
    sessionId: string = "";
}