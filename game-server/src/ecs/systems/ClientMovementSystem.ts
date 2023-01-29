import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';

import { ClientMovement } from '../components/ClientMovement';
import { P2Body } from '../components/P2Body';

export const createClientMovementSystem = () => {
    // create queries
    const clientMoveQuery = defineQuery([P2Body, ClientMovement]);

    const PACMAN_SPEED = 1.5;
    const DASH_DISTANCE = 3;

    return defineSystem((ecsWorld: IWorld) => {

        const queryClientMove = clientMoveQuery(ecsWorld);
        queryClientMove.map(eid => {
            let velX = 0;
            let velY = 0;
            let angle = 0;

            if (ClientMovement.up[eid]) {
                velY = 1;
            }
            if (ClientMovement.down[eid]) {
                velY = -1;
            }
            if (ClientMovement.left[eid]) {
                velX = -1;
            }
            if (ClientMovement.right[eid]) {
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
                if (ClientMovement.dash[eid]) {
                    P2Body.position.x[eid] += velX / length * DASH_DISTANCE;
                    P2Body.position.y[eid] += velY / length * DASH_DISTANCE;

                    ClientMovement.dash[eid] = 0;
                }
            } else {
                P2Body.velocity.x[eid] = 0;
                P2Body.velocity.y[eid] = 0;

                ClientMovement.dash[eid] = 0;
            }
        });

        return ecsWorld;
    })
}