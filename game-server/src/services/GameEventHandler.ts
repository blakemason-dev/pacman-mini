import {
    Component,
    hasComponent,
    IWorld,
} from 'bitecs';

import { EventEmitter } from 'events';
import { ClientPacmanController } from '../ecs/components/ClientPacmanController';
import { MiniPacmanController, MiniPacmanState } from '../ecs/components/MiniPacmanController';
import { MiniPacmanRescueZone } from '../ecs/components/MiniPacmanRescueZone';


export class GameEventHandler {

    private world!: IWorld;
    private events!: EventEmitter;

    constructor(world: IWorld, events: EventEmitter) {
        this.world = world;
        this.events = events;


    }

    start() {
        this.events.on('beginEntityContact', eids => {
            let eidPair: number[] | boolean = false;

            // mini pacman collision with portal
            eidPair = this.getComponentPair(MiniPacmanController, MiniPacmanRescueZone, eids);
            if (eidPair) {
                MiniPacmanController.eventPortalContact[eidPair[0]] = 1;
            }

            // mini pacman collision with a pacman
            eidPair = this.getComponentPair(MiniPacmanController, ClientPacmanController, eids);
            if (eidPair) {
                MiniPacmanController.eventPacmanContact[eidPair[0]] = 1;
                MiniPacmanController.eventPacmanContactEid[eidPair[0]] = eidPair[1];
            }

            // pacman collision with another pacman
            eidPair = this.getComponentPair(ClientPacmanController, ClientPacmanController, eids);
            if (eidPair) {
                ClientPacmanController.eventPacmanContact[eidPair[0]] = 1;
                ClientPacmanController.eventPacmanContactEid[eidPair[0]] = eidPair[1];
                ClientPacmanController.eventPacmanContact[eidPair[1]] = 1;
                ClientPacmanController.eventPacmanContactEid[eidPair[1]] = eidPair[0];
            }
        });

        this.events.on('endEntityContact', eids => {
            let eidPair: number[] | boolean = false;

            // pacman de-collision with another pacman
            eidPair = this.getComponentPair(ClientPacmanController, ClientPacmanController, eids);
            if (eidPair) {
                ClientPacmanController.eventPacmanContact[eidPair[0]] = 0;
                ClientPacmanController.eventPacmanContactEid[eidPair[0]] = eidPair[1];
                ClientPacmanController.eventPacmanContact[eidPair[1]] = 0;
                ClientPacmanController.eventPacmanContactEid[eidPair[1]] = eidPair[0];
            }
        });

    }

    // if get a matching component pair, return an array of eid in the order this function requests
    getComponentPair(componentA: Component, componentB: Component, eids: number[]) {
        if (hasComponent(this.world, componentA, eids[0]) && hasComponent(this.world, componentB, eids[1])) {
            return [eids[0], eids[1]];
        } else if (hasComponent(this.world, componentA, eids[1]) && hasComponent(this.world, componentB, eids[0])) {
            return [eids[1], eids[0]];
        } else {
            return false;
        }
    }


}