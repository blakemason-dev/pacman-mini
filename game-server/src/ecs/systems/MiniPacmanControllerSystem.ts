import { 
    defineSystem,
    IWorld,
    hasComponent
} from "bitecs";

import { EventEmitter } from 'events';
import { MiniPacmanController } from "../components/MiniPacmanController";

const createMiniPacmanControllerSystem = (world: IWorld, events: EventEmitter) => {

    // create an event handler for collision contact
    events.on('beginEntityContact', (eids) => {
        let miniPacmanEid 
    })

    return defineSystem((ecsWorld: IWorld) => {

        return ecsWorld;
    });
}