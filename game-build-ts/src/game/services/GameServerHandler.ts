import { Schema } from "@colyseus/schema";
import { throws } from "assert";
import { Client, Room } from "colyseus.js";
import EventEmitter from "events";

import { iPacmanMiniState } from '../../../../game-server/src/types/iPacmanMiniState';
import { GameObjectType } from "../../../../game-server/src/types/sGameObject";
import { sMiniPacman } from "../../../../game-server/src/types/sMiniPacman";

export default class GameServerHandler {
    private client!: Client;
    room!: Room<iPacmanMiniState & Schema>;
    events!: EventEmitter;
    clientTime!: number;

    constructor() {
        this.client = new Client("ws://localhost:8765");
        this.events = new EventEmitter();
    }

    // private previous_ms = Date.now();

    async join() {
        this.room = await this.client.joinOrCreate<iPacmanMiniState & Schema>('pacman-mini');
    
        this.room.onStateChange(state => {
            this.events.emit("state-changed", state, state.serverTime);
        });

        this.room.state.gameObjects.onRemove = (player, key) => {
            if (player.type === GameObjectType.MiniPacman) {
                this.events.emit('mini-pacman-saved', player);
            }
        };

        this.room.onMessage('start-match', (serverGameConfig) => {
            this.events.emit('start-match', serverGameConfig);
        });
    }

    leave() {

    }
}