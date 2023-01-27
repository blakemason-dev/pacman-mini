import { MapSchema, Schema, type } from '@colyseus/schema';
import { sGameObject } from './sGameObject';

export enum PacmanMiniRoomStatus {
    PhaseA,
    PhaseB,
    PhaseC
}

export interface iPacmanMiniState {
    gameObjects: MapSchema<sGameObject>;
    status: number;
}