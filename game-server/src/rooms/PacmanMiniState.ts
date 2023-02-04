import { Schema, MapSchema, type } from "@colyseus/schema";
import { iPacmanMiniState } from "../types/iPacmanMiniState";
import { sGameObject } from "../types/sGameObject";


export default class PacmanMiniState extends Schema implements iPacmanMiniState {
    @type({map: sGameObject})
    gameObjects = new MapSchema<sGameObject>();

    @type('number')
    status = 0;

    @type('number')
    serverTime = 0;
}