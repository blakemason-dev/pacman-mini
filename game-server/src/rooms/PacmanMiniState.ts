import { Schema, MapSchema, type } from "@colyseus/schema";
import { iPacmanMiniState } from "../types/iPacmanMiniState";
import { sGameObject } from "../types/sGameObject";


export default class PacmanMiniState extends Schema implements iPacmanMiniState {
    @type([sGameObject])
    gameObjects: MapSchema<sGameObject> = new MapSchema<sGameObject>();

    @type('number')
    status: number = 0;
}