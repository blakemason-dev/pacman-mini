import { 
    defineSystem,
    IWorld,
    hasComponent,
    defineQuery
} from "bitecs";

import { EventEmitter } from 'events';
import { Color } from "../components/Color";
import { MiniPacmanController, MiniPacmanState } from "../components/MiniPacmanController";
import { P2Body } from "../components/P2Body";
import { P2ShapeCircle } from "../components/P2ShapeCircle";

export const createMiniPacmanControllerSystem = (world: IWorld, events: EventEmitter) => {

    const miniPacmenQuery = defineQuery([MiniPacmanController]);

    let previous_ms = Date.now();

    return defineSystem((ecsWorld: IWorld) => {
        // update times
        const current_ms = Date.now();
        const dt_ms = current_ms - previous_ms;
        previous_ms = current_ms;

        // UPDATES
        const miniPacmen = miniPacmenQuery(ecsWorld);
        miniPacmen.map(eid => {
            // handle events
            if (MiniPacmanController.eventPortalContact[eid]) {
                console.log('Rescued!');
                MiniPacmanController.eventPortalContact[eid] = 0;
            }
            if (MiniPacmanController.eventPacmanContact[eid]) {
                // Change pacman state to following and make it same color as its new friend
                if (MiniPacmanController.state[eid] !== MiniPacmanState.Following) {
                    MiniPacmanController.state[eid] = MiniPacmanState.Following;
                    Color.hexCode[eid] = Color.hexCode[MiniPacmanController.followingEid[eid]];
                }
                MiniPacmanController.eventPacmanContact[eid] = 0;
            }

            // handle different states
            switch (MiniPacmanController.state[eid]) {
                case MiniPacmanState.Roaming: {
                    MiniPacmanController.roamTimer[eid] -= dt_ms;
                    if (MiniPacmanController.roamTimer[eid] <= 0) {
                        MiniPacmanController.roamTimer[eid] = Math.random()*2000 + 500;
                        MiniPacmanController.roamVelocity.x[eid] = Math.random() - 0.5;
                        MiniPacmanController.roamVelocity.y[eid] = Math.random() - 0.5;
                    
                        if (hasComponent(ecsWorld, P2Body, eid)) {
                            P2Body.velocity.x[eid] = MiniPacmanController.roamVelocity.x[eid];
                            P2Body.velocity.y[eid] = MiniPacmanController.roamVelocity.y[eid];

                            // also calc a new angle while here
                            const angle = Math.atan2(MiniPacmanController.roamVelocity.y[eid], MiniPacmanController.roamVelocity.x[eid]);
                            P2Body.angle[eid] = angle;
                        }
                    }
                    break;
                }
                case MiniPacmanState.Following: {
                    const followingEid = MiniPacmanController.followingEid[eid];
                    let distX = P2Body.position.x[followingEid] - P2Body.position.x[eid];
                    let distY = P2Body.position.y[followingEid] - P2Body.position.y[eid];

                    P2Body.velocity.x[eid] = distX;
                    P2Body.velocity.y[eid] = distY;

                    // also calc a new angle while here
                    const angle = Math.atan2(P2Body.velocity.y[eid], P2Body.velocity.x[eid]);
                    P2Body.angle[eid] = angle;
                }
                default: break;
            }
        });

        return ecsWorld;
    });
}