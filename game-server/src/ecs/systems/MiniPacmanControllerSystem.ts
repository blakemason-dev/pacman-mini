import { MapSchema } from "@colyseus/schema";
import { 
    defineSystem,
    IWorld,
    hasComponent,
    defineQuery
} from "bitecs";

import { EventEmitter } from 'events';
import { sGameObject } from "../../types/sGameObject";
import { ClientPacmanController, ClientPacmanState } from "../components/ClientPacmanController";
import { Color } from "../components/Color";
import { MiniPacmanController, MiniPacmanState } from "../components/MiniPacmanController";
import { P2Body } from "../components/P2Body";
import { P2ShapeCircle } from "../components/P2ShapeCircle";
import { destroyPfMiniPacman } from "../prefabs/pfMiniPacman";

export const createMiniPacmanControllerSystem = (world: IWorld, events: EventEmitter, gos: MapSchema<sGameObject>) => {

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
            // destroy
            if (MiniPacmanController.triggerDestroy[eid]) {
                destroyPfMiniPacman(ecsWorld, eid, gos);
            }

            // handle events
            if (MiniPacmanController.inPortal[eid]) {
                // console.log('Rescued!');
                if (MiniPacmanController.state[eid] === MiniPacmanState.Following) {
                    rescue(eid);
                }
            }
            if (MiniPacmanController.eventPacmanContact[eid]) {
                // Change pacman state to following and make it same color as its new friend
                const contactEid = MiniPacmanController.eventPacmanContactEid[eid];
                if (MiniPacmanController.state[eid] !== MiniPacmanState.Following && ClientPacmanController.state[contactEid] !== ClientPacmanState.Knocked) {
                    MiniPacmanController.state[eid] = MiniPacmanState.Following;
                    MiniPacmanController.followingEid[eid] = contactEid;
                    Color.hexCode[eid] = Color.hexCode[contactEid];
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
                    // if the pacman we are following gets knocked we need to free roam again
                    if (ClientPacmanController.state[followingEid] === ClientPacmanState.Knocked) {
                        MiniPacmanController.state[eid] = MiniPacmanState.Roaming;
                        Color.hexCode[eid] = 0xffcc00;
                    } else { // our leader isn't knocked so follow them
                        let distX = P2Body.position.x[followingEid] - P2Body.position.x[eid];
                        let distY = P2Body.position.y[followingEid] - P2Body.position.y[eid];
                        
                        P2Body.velocity.x[eid] = distX*2;
                        P2Body.velocity.y[eid] = distY*2;
                        
                        // also calc a new angle while here
                        const angle = Math.atan2(P2Body.velocity.y[eid], P2Body.velocity.x[eid]);
                        P2Body.angle[eid] = angle;
                    }
                }
                default: break;
            }
        });

        return ecsWorld;
    });
}

const rescue = (eid: number) => {
    const leaderEid = MiniPacmanController.followingEid[eid];
    ClientPacmanController.score[leaderEid] += 1;
    MiniPacmanController.triggerDestroy[eid] = 1;
}