import { Schema } from "@colyseus/schema";
import { Client, Room } from "colyseus.js";
import EventEmitter from "events";

import { iPacmanMiniState } from '../../../../game-server/src/types/iPacmanMiniState';

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
            // console.log(state.serverTime);
        });

        // this.room.onMessage('update-game-state', (dt_ms) => {
        //     this.events.emit('update-game-state', this.room.state);

        //     // console.log(dt_ms);
            
        //     const c = Date.now();
        //     const dt = c - this.previous_ms;
        //     this.previous_ms = c;
        //     console.log(dt, dt_ms);
        // });

        this.room.onMessage('start-match', (serverGameConfig) => {
            this.events.emit('start-match', serverGameConfig);
        });
    }

    leave() {

    }
}