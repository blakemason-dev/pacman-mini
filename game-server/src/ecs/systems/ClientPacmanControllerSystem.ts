import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';

import { ClientPacmanController, ClientPacmanState } from '../components/ClientPacmanController';
import { P2Body } from '../components/P2Body';

const PACMAN_SPEED = 3.5;
const DASH_DISTANCE = 3;

export const createClientPacmanControllerSystem = () => {
    // create queries
    const pacmanQuery = defineQuery([P2Body, ClientPacmanController]);

    let previous_ms = Date.now();

    return defineSystem((ecsWorld: IWorld) => {
        // calc dt
        const current_ms = Date.now();
        const dt_ms = current_ms - previous_ms;
        previous_ms = current_ms;

        const pacmen = pacmanQuery(ecsWorld);
        pacmen.map(eid => {
            // check states
            switch (ClientPacmanController.state[eid]) {
                case ClientPacmanState.Roaming: {
                    handleRoaming(eid);
                    break;
                }
                case ClientPacmanState.Dashing: {
                    handleDashing(eid, dt_ms);
                    break;
                }
                case ClientPacmanState.Knocked: {

                    break;
                }
                default: break;
            }
        });

        return ecsWorld;
    })
}

const handleRoaming = (eid: number) => {
    let velX = 0;
    let velY = 0;
    let angle = 0;
    let length = 1;

    // get direction clients wants to go
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

    // if movement
    if (Math.abs(velX) > 0 || Math.abs(velY) > 0) {
        // grab vector length so we can normalize
        length = Math.sqrt(velX ** 2 + velY ** 2);
        
        // also calc a new angle while here
        angle = Math.atan2(velY, velX);
        
        // see if dash was pushed
        if (ClientPacmanController.eventDash[eid]) {
            ClientPacmanController.state[eid] = ClientPacmanState.Dashing;
            ClientPacmanController.dashDirection.x[eid] = velX / length;
            ClientPacmanController.dashDirection.y[eid] = velY / length;
            ClientPacmanController.dashTime[eid] = 0.2;
            ClientPacmanController.dashSpeed[eid] = 15;
            P2Body.velocity.x[eid] = velX / length * ClientPacmanController.dashSpeed[eid];
            P2Body.velocity.y[eid] = velY / length * ClientPacmanController.dashSpeed[eid];
            ClientPacmanController.eventDash[eid] = 0;
        } else {
            // just do normal movement
            P2Body.velocity.x[eid] = velX / length * PACMAN_SPEED;
            P2Body.velocity.y[eid] = velY / length * PACMAN_SPEED;
        }

        // set body angle
        P2Body.angle[eid] = angle;
    } else {
        // if we got here just stop moving
        P2Body.velocity.x[eid] = 0;
        P2Body.velocity.y[eid] = 0;

        ClientPacmanController.eventDash[eid] = 0;
    }

}

const handleDashing = (eid: number, dt_ms: number) => {
    ClientPacmanController.dashTime[eid] -= dt_ms*0.001;
    if (ClientPacmanController.dashTime[eid] <= 0) {
        ClientPacmanController.state[eid] = ClientPacmanState.Roaming;
    }
}