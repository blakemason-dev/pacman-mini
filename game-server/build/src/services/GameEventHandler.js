"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEventHandler = void 0;
const bitecs_1 = require("bitecs");
const ClientPacmanController_1 = require("../ecs/components/ClientPacmanController");
const MiniPacmanController_1 = require("../ecs/components/MiniPacmanController");
const MiniPacmanRescueZone_1 = require("../ecs/components/MiniPacmanRescueZone");
class GameEventHandler {
    constructor(world, events) {
        this.world = world;
        this.events = events;
    }
    start() {
        this.events.on('beginEntityContact', eids => {
            let eidPair = false;
            // mini pacman collision with portal
            eidPair = this.getComponentPair(MiniPacmanController_1.MiniPacmanController, MiniPacmanRescueZone_1.MiniPacmanRescueZone, eids);
            if (eidPair) {
                MiniPacmanController_1.MiniPacmanController.eventPortalContact[eidPair[0]] = 1;
                MiniPacmanController_1.MiniPacmanController.inPortal[eidPair[0]] = 1;
            }
            // mini pacman collision with a pacman
            eidPair = this.getComponentPair(MiniPacmanController_1.MiniPacmanController, ClientPacmanController_1.ClientPacmanController, eids);
            if (eidPair) {
                MiniPacmanController_1.MiniPacmanController.eventPacmanContact[eidPair[0]] = 1;
                MiniPacmanController_1.MiniPacmanController.eventPacmanContactEid[eidPair[0]] = eidPair[1];
            }
            // pacman collision with another pacman
            eidPair = this.getComponentPair(ClientPacmanController_1.ClientPacmanController, ClientPacmanController_1.ClientPacmanController, eids);
            if (eidPair) {
                ClientPacmanController_1.ClientPacmanController.eventPacmanContact[eidPair[0]] = 1;
                ClientPacmanController_1.ClientPacmanController.eventPacmanContactEid[eidPair[0]] = eidPair[1];
                ClientPacmanController_1.ClientPacmanController.eventPacmanContact[eidPair[1]] = 1;
                ClientPacmanController_1.ClientPacmanController.eventPacmanContactEid[eidPair[1]] = eidPair[0];
            }
        });
        this.events.on('endEntityContact', eids => {
            let eidPair = false;
            // mini pacman de-collision with portal
            eidPair = this.getComponentPair(MiniPacmanController_1.MiniPacmanController, MiniPacmanRescueZone_1.MiniPacmanRescueZone, eids);
            if (eidPair) {
                MiniPacmanController_1.MiniPacmanController.eventPortalContact[eidPair[0]] = 0;
                MiniPacmanController_1.MiniPacmanController.inPortal[eidPair[0]] = 0;
            }
            // pacman de-collision with another pacman
            eidPair = this.getComponentPair(ClientPacmanController_1.ClientPacmanController, ClientPacmanController_1.ClientPacmanController, eids);
            if (eidPair) {
                ClientPacmanController_1.ClientPacmanController.eventPacmanContact[eidPair[0]] = 0;
                ClientPacmanController_1.ClientPacmanController.eventPacmanContactEid[eidPair[0]] = eidPair[1];
                ClientPacmanController_1.ClientPacmanController.eventPacmanContact[eidPair[1]] = 0;
                ClientPacmanController_1.ClientPacmanController.eventPacmanContactEid[eidPair[1]] = eidPair[0];
            }
        });
    }
    // if get a matching component pair, return an array of eid in the order this function requests
    getComponentPair(componentA, componentB, eids) {
        if ((0, bitecs_1.hasComponent)(this.world, componentA, eids[0]) && (0, bitecs_1.hasComponent)(this.world, componentB, eids[1])) {
            return [eids[0], eids[1]];
        }
        else if ((0, bitecs_1.hasComponent)(this.world, componentA, eids[1]) && (0, bitecs_1.hasComponent)(this.world, componentB, eids[0])) {
            return [eids[1], eids[0]];
        }
        else {
            return false;
        }
    }
}
exports.GameEventHandler = GameEventHandler;
