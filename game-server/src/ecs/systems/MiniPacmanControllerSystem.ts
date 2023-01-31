import { 
    defineSystem,
    IWorld,
    hasComponent,
    defineQuery
} from "bitecs";

import { EventEmitter } from 'events';
import { MiniPacmanController } from "../components/MiniPacmanController";

export const createMiniPacmanControllerSystem = (world: IWorld, events: EventEmitter) => {

    const miniPacmenQuery = defineQuery([MiniPacmanController]);

    return defineSystem((ecsWorld: IWorld) => {

        const miniPacmen = miniPacmenQuery(ecsWorld);
        miniPacmen.map(eid => {
            if (MiniPacmanController.eventPortalContact[eid]) {
                console.log('Rescued!');
                MiniPacmanController.eventPortalContact[eid] = 0;
            }
            if (MiniPacmanController.eventPacmanContact[eid]) {
                console.log('My hero!');
                MiniPacmanController.eventPacmanContact[eid] = 0;
            }
        });

        return ecsWorld;
    });
}