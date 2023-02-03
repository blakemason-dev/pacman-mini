import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';

import { ClientPacmanController } from '../components/ClientPacmanController';
import { P2Body } from '../components/P2Body';

export const createClientPacmanControllerSystem = () => {
    // create queries
    const clientMoveQuery = defineQuery([P2Body, ClientPacmanController]);

    const PACMAN_SPEED = 1.5;
    const DASH_DISTANCE = 3;

    return defineSystem((ecsWorld: IWorld) => {

        const queryClientMove = clientMoveQuery(ecsWorld);
        queryClientMove.map(eid => {
            let velX = 0;
            let velY = 0;
            let angle = 0;

            if (ClientPacmanController.eventUp[eid]) {
                velY = 1;
            }
            if (ClientPacmanController.eventDown[eid]) {
                velY = -1;
            }
            if (ClientPacmanController.eventLeft[eid]) {
                velX = -1;
            }
            if (ClientPacmanController.eventRight[eid]) {
                velX = 1;
            }

            let length = 1;
            if (Math.abs(velX) > 0 || Math.abs(velY) > 0) {
                length = Math.sqrt(velX ** 2 + velY ** 2);

                // also calc a new angle while here
                angle = Math.atan2(velY, velX);

                // set new velocity and angle
                P2Body.velocity.x[eid] = velX / length * PACMAN_SPEED;
                P2Body.velocity.y[eid] = velY / length * PACMAN_SPEED;
                P2Body.angle[eid] = angle;

                // See if we can dash
                if (ClientPacmanController.eventDash[eid]) {
                    P2Body.position.x[eid] += velX / length * DASH_DISTANCE;
                    P2Body.position.y[eid] += velY / length * DASH_DISTANCE;

                    ClientPacmanController.eventDash[eid] = 0;
                }
            } else {
                P2Body.velocity.x[eid] = 0;
                P2Body.velocity.y[eid] = 0;

                ClientPacmanController.eventDash[eid] = 0;
            }


            // random collision check
            if (ClientPacmanController.eventPortal[eid]) {
                // console.log('The Rescue Zone!!');
                ClientPacmanController.eventPortal[eid] = 0;
            }
        });

        return ecsWorld;
    })
}