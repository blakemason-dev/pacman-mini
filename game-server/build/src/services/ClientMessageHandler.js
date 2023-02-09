"use strict";
// - Handles all messages sent by clients to the room
// - All entity component modifying code goes here
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMessageHandler = void 0;
const ClientPacmanController_1 = require("../ecs/components/ClientPacmanController");
const eMessages_1 = require("../types/eMessages");
class ClientMessageHandler {
    constructor(room) {
        this.room = room;
    }
    startListening() {
        this.room.onMessage(eMessages_1.Message.ClientMoveUpBegin, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventUp[eid] = 1;
        });
        this.room.onMessage(eMessages_1.Message.ClientMoveUpEnd, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventUp[eid] = 0;
        });
        this.room.onMessage(eMessages_1.Message.ClientMoveDownBegin, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventDown[eid] = 1;
        });
        this.room.onMessage(eMessages_1.Message.ClientMoveDownEnd, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventDown[eid] = 0;
        });
        this.room.onMessage(eMessages_1.Message.ClientMoveLeftBegin, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventLeft[eid] = 1;
        });
        this.room.onMessage(eMessages_1.Message.ClientMoveLeftEnd, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventLeft[eid] = 0;
        });
        this.room.onMessage(eMessages_1.Message.ClientMoveRightBegin, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventRight[eid] = 1;
        });
        this.room.onMessage(eMessages_1.Message.ClientMoveRightEnd, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventRight[eid] = 0;
        });
        this.room.onMessage(eMessages_1.Message.ClientDash, (client) => {
            const eid = this.getClientEid(client);
            if (eid > -1)
                ClientPacmanController_1.ClientPacmanController.eventDash[eid] = 1;
        });
    }
    stopListening() {
    }
    getClientEid(client) {
        let returnEid = -1;
        this.room.state.gameObjects.forEach((go, eid) => {
            if (go.sessionId === client.sessionId) {
                returnEid = parseInt(eid);
            }
        });
        return returnEid;
    }
}
exports.ClientMessageHandler = ClientMessageHandler;
