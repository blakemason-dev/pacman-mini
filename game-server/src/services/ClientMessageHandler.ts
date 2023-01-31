// - Handles all messages sent by clients to the room
// - All entity component modifying code goes here

import { Client, Room } from "colyseus";
import { ClientPacmanController } from "../ecs/components/ClientPacmanController";
import PacmanMini from "../rooms/PacmanMini";
import { Message } from "../types/eMessages";
import { sGameObject } from "../types/sGameObject";


export class ClientMessageHandler {
    private room!: PacmanMini;
    
    constructor(room: PacmanMini) {
        this.room = room;
    }

    startListening() {
        this.room.onMessage(Message.ClientMoveUpBegin, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventUp[eid] = 1;
        });
        this.room.onMessage(Message.ClientMoveUpEnd, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventUp[eid] = 0;
        });

        this.room.onMessage(Message.ClientMoveDownBegin, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventDown[eid] = 1;
        });
        this.room.onMessage(Message.ClientMoveDownEnd, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventDown[eid] = 0;
        });

        this.room.onMessage(Message.ClientMoveLeftBegin, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventLeft[eid] = 1;
        });
        this.room.onMessage(Message.ClientMoveLeftEnd, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventLeft[eid] = 0;
        });

        this.room.onMessage(Message.ClientMoveRightBegin, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventRight[eid] = 1;
        });
        this.room.onMessage(Message.ClientMoveRightEnd, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventRight[eid] = 0;
        });

        this.room.onMessage(Message.ClientDash, (client: Client) => {
            const eid = this.getClientEid(client);
            if (eid > -1) ClientPacmanController.eventDash[eid] = 1;
        });
    }

    stopListening() {

    }

    private getClientEid(client: Client) {
        let returnEid = -1;
        this.room.state.gameObjects.forEach((go, eid) => {
            if (go.sessionId === client.sessionId) {
                returnEid = parseInt(eid);
            }
        });
        return returnEid;
    }
}