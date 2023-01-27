import { Schema } from "@colyseus/schema";
import { Client, Room } from "colyseus.js";
import EventEmitter from "events";

import { iPacmanMiniState } from '../../../../game-server/src/types/iPacmanMiniState';

export default class GameServerHandler {
    private client!: Client;
    private room!: Room<iPacmanMiniState & Schema>;
    events!: EventEmitter;

    constructor() {
        this.client = new Client("ws://localhost:8765");
        this.events = new EventEmitter();
    }

    async join() {
        this.room = await this.client.joinOrCreate<iPacmanMiniState & Schema>('pacman-mini');
    
        this.room.onStateChange(state => {
            this.events.emit("state-changed", state);
        });

        this.room.onMessage('start-match', (serverGameConfig) => {
            this.events.emit('start-match', serverGameConfig);
        });
    }

    leave() {

    }
}