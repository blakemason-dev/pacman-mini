import { Schema, type } from '@colyseus/schema';

export enum GameObjectType {
    Pacman,
    MiniPacman,
    Rock,
    Background,
    Wall
}

export class sGameObject extends Schema {
    @type('number')
    type!: number;

    @type('string')
    sessionId!: string;

    constructor(type: GameObjectType = -1, sessionId: string = "") {
        super();
        this.type = type;
        this.sessionId = sessionId;
    }
}