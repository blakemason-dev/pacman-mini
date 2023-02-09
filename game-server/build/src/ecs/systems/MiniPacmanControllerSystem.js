"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMiniPacmanControllerSystem = void 0;
const bitecs_1 = require("bitecs");
const sGameObject_1 = require("../../types/sGameObject");
const ClientPacmanController_1 = require("../components/ClientPacmanController");
const Color_1 = require("../components/Color");
const MiniPacmanController_1 = require("../components/MiniPacmanController");
const P2Body_1 = require("../components/P2Body");
const pfMiniPacman_1 = require("../prefabs/pfMiniPacman");
const createMiniPacmanControllerSystem = (world, events, gos) => {
    const miniPacmenQuery = (0, bitecs_1.defineQuery)([MiniPacmanController_1.MiniPacmanController]);
    let previous_ms = Date.now();
    return (0, bitecs_1.defineSystem)((ecsWorld) => {
        // update times
        const current_ms = Date.now();
        const dt_ms = current_ms - previous_ms;
        previous_ms = current_ms;
        // UPDATES
        const miniPacmen = miniPacmenQuery(ecsWorld);
        miniPacmen.map(eid => {
            // destroy
            // if (MiniPacmanController.triggerDestroy[eid]) {
            //     destroyPfMiniPacman(ecsWorld, eid, gos);
            // }
            // handle events
            if (MiniPacmanController_1.MiniPacmanController.inPortal[eid]) {
                if (MiniPacmanController_1.MiniPacmanController.state[eid] === MiniPacmanController_1.MiniPacmanState.Following) {
                    rescue(eid);
                    (0, pfMiniPacman_1.destroyPfMiniPacman)(ecsWorld, eid, gos);
                    let allGone = true;
                    gos.forEach((go, eid) => {
                        if (go.type === sGameObject_1.GameObjectType.MiniPacman) {
                            allGone = false;
                        }
                    });
                    if (allGone) {
                        events.emit('all-mini-pacmen-saved');
                    }
                }
            }
            if (MiniPacmanController_1.MiniPacmanController.eventPacmanContact[eid]) {
                // Change pacman state to following and make it same color as its new friend
                const contactEid = MiniPacmanController_1.MiniPacmanController.eventPacmanContactEid[eid];
                if (MiniPacmanController_1.MiniPacmanController.state[eid] !== MiniPacmanController_1.MiniPacmanState.Following && ClientPacmanController_1.ClientPacmanController.state[contactEid] !== ClientPacmanController_1.ClientPacmanState.Knocked) {
                    MiniPacmanController_1.MiniPacmanController.state[eid] = MiniPacmanController_1.MiniPacmanState.Following;
                    MiniPacmanController_1.MiniPacmanController.followingEid[eid] = contactEid;
                    Color_1.Color.hexCode[eid] = Color_1.Color.hexCode[contactEid];
                }
                MiniPacmanController_1.MiniPacmanController.eventPacmanContact[eid] = 0;
            }
            // handle different states
            switch (MiniPacmanController_1.MiniPacmanController.state[eid]) {
                case MiniPacmanController_1.MiniPacmanState.Roaming: {
                    MiniPacmanController_1.MiniPacmanController.roamTimer[eid] -= dt_ms;
                    if (MiniPacmanController_1.MiniPacmanController.roamTimer[eid] <= 0) {
                        MiniPacmanController_1.MiniPacmanController.roamTimer[eid] = Math.random() * 2000 + 500;
                        MiniPacmanController_1.MiniPacmanController.roamVelocity.x[eid] = Math.random() - 0.5;
                        MiniPacmanController_1.MiniPacmanController.roamVelocity.y[eid] = Math.random() - 0.5;
                        if ((0, bitecs_1.hasComponent)(ecsWorld, P2Body_1.P2Body, eid)) {
                            P2Body_1.P2Body.velocity.x[eid] = MiniPacmanController_1.MiniPacmanController.roamVelocity.x[eid];
                            P2Body_1.P2Body.velocity.y[eid] = MiniPacmanController_1.MiniPacmanController.roamVelocity.y[eid];
                            // also calc a new angle while here
                            const angle = Math.atan2(MiniPacmanController_1.MiniPacmanController.roamVelocity.y[eid], MiniPacmanController_1.MiniPacmanController.roamVelocity.x[eid]);
                            P2Body_1.P2Body.angle[eid] = angle;
                        }
                    }
                    break;
                }
                case MiniPacmanController_1.MiniPacmanState.Following: {
                    const followingEid = MiniPacmanController_1.MiniPacmanController.followingEid[eid];
                    // if the pacman we are following gets knocked we need to free roam again
                    if (ClientPacmanController_1.ClientPacmanController.state[followingEid] === ClientPacmanController_1.ClientPacmanState.Knocked) {
                        MiniPacmanController_1.MiniPacmanController.state[eid] = MiniPacmanController_1.MiniPacmanState.Roaming;
                        Color_1.Color.hexCode[eid] = 0xffcc00;
                    }
                    else { // our leader isn't knocked so follow them
                        let distX = P2Body_1.P2Body.position.x[followingEid] - P2Body_1.P2Body.position.x[eid];
                        let distY = P2Body_1.P2Body.position.y[followingEid] - P2Body_1.P2Body.position.y[eid];
                        P2Body_1.P2Body.velocity.x[eid] = distX * 2;
                        P2Body_1.P2Body.velocity.y[eid] = distY * 2;
                        // also calc a new angle while here
                        const angle = Math.atan2(P2Body_1.P2Body.velocity.y[eid], P2Body_1.P2Body.velocity.x[eid]);
                        P2Body_1.P2Body.angle[eid] = angle;
                    }
                }
                default: break;
            }
        });
        return ecsWorld;
    });
};
exports.createMiniPacmanControllerSystem = createMiniPacmanControllerSystem;
const rescue = (eid) => {
    const leaderEid = MiniPacmanController_1.MiniPacmanController.followingEid[eid];
    ClientPacmanController_1.ClientPacmanController.score[leaderEid] += 1;
    // MiniPacmanController.triggerDestroy[eid] = 1;
};
