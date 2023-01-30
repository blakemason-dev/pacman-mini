import {
    Component,
    hasComponent,
    IWorld,
} from 'bitecs';

import { EventEmitter } from 'events';
import { ClientMovement } from '../ecs/components/ClientMovement';
import { MiniPacmanController } from '../ecs/components/MiniPacmanController';
import { MiniPacmanRescuer } from '../ecs/components/MiniPacmanRescuer';


export class GameEventHandler {

    private world!: IWorld;
    private events!: EventEmitter;

    constructor(world: IWorld, events: EventEmitter) {
        this.world = world;
        this.events = events;


    }

    start() {
        this.events.on('beginEntityContact', eids => {
            const eidPair = this.getComponentPair(ClientMovement, MiniPacmanRescuer, eids);
            console.log(eidPair);
            if (eidPair) {
                console.log('ouch');
                ClientMovement.ouch[eidPair[0]] = 1;
            }
        });

    }

    // if get a matching component pair, return an array of eid in the order this function requests
    getComponentPair(componentA: Component, componentB: Component, eids: number[]) {
        if ( hasComponent(this.world, componentA, eids[0]) && hasComponent(this.world, componentB, eids[1]) ) {
            return [eids[0], eids[1]];
        } else if ( hasComponent(this.world, componentA, eids[1]) && hasComponent(this.world, componentB, eids[0]) ) {
            return [eids[1], eids[0]];
        } else {
            return false;
        }
    }


}