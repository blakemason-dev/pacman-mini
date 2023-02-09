"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientPacmanControllerSystem = void 0;
const bitecs_1 = require("bitecs");
const ClientPacmanController_1 = require("../components/ClientPacmanController");
const P2Body_1 = require("../components/P2Body");
const PACMAN_SPEED = 3.5;
const DASH_DISTANCE = 3;
const createClientPacmanControllerSystem = () => {
    // create queries
    const pacmanQuery = (0, bitecs_1.defineQuery)([P2Body_1.P2Body, ClientPacmanController_1.ClientPacmanController]);
    let previous_ms = Date.now();
    return (0, bitecs_1.defineSystem)((ecsWorld) => {
        // calc dt
        const current_ms = Date.now();
        const dt_ms = current_ms - previous_ms;
        previous_ms = current_ms;
        const pacmen = pacmanQuery(ecsWorld);
        pacmen.map(eid => {
            // check events
            if (ClientPacmanController_1.ClientPacmanController.eventPacmanContact[eid]) {
                handlePacmanContact(eid);
                // ClientPacmanController.eventPacmanContact[eid] = 0;
            }
            // check states
            switch (ClientPacmanController_1.ClientPacmanController.state[eid]) {
                case ClientPacmanController_1.ClientPacmanState.Roaming: {
                    handleRoaming(eid, dt_ms);
                    break;
                }
                case ClientPacmanController_1.ClientPacmanState.Dashing: {
                    handleDashing(eid, dt_ms);
                    break;
                }
                case ClientPacmanController_1.ClientPacmanState.Knocked: {
                    handleKnocked(eid, dt_ms);
                    break;
                }
                default: break;
            }
        });
        return ecsWorld;
    });
};
exports.createClientPacmanControllerSystem = createClientPacmanControllerSystem;
const handleRoaming = (eid, dt_ms) => {
    let velX = 0;
    let velY = 0;
    let angle = 0;
    let length = 1;
    // get direction clients wants to go
    if (ClientPacmanController_1.ClientPacmanController.eventUp[eid]) {
        velY = 1;
    }
    if (ClientPacmanController_1.ClientPacmanController.eventDown[eid]) {
        velY = -1;
    }
    if (ClientPacmanController_1.ClientPacmanController.eventLeft[eid]) {
        velX = -1;
    }
    if (ClientPacmanController_1.ClientPacmanController.eventRight[eid]) {
        velX = 1;
    }
    ClientPacmanController_1.ClientPacmanController.dashCooldown[eid] -= dt_ms * 0.001;
    // if movement
    if (Math.abs(velX) > 0 || Math.abs(velY) > 0) {
        // grab vector length so we can normalize
        length = Math.sqrt(velX ** 2 + velY ** 2);
        // also calc a new angle while here
        angle = Math.atan2(velY, velX);
        // see if dash was pushed
        if (ClientPacmanController_1.ClientPacmanController.eventDash[eid] && ClientPacmanController_1.ClientPacmanController.dashCooldown[eid] <= 0) {
            ClientPacmanController_1.ClientPacmanController.state[eid] = ClientPacmanController_1.ClientPacmanState.Dashing;
            ClientPacmanController_1.ClientPacmanController.dashDirection.x[eid] = velX / length;
            ClientPacmanController_1.ClientPacmanController.dashDirection.y[eid] = velY / length;
            ClientPacmanController_1.ClientPacmanController.dashTime[eid] = 0.2;
            ClientPacmanController_1.ClientPacmanController.dashSpeed[eid] = 15;
            P2Body_1.P2Body.velocity.x[eid] = velX / length * ClientPacmanController_1.ClientPacmanController.dashSpeed[eid];
            P2Body_1.P2Body.velocity.y[eid] = velY / length * ClientPacmanController_1.ClientPacmanController.dashSpeed[eid];
            ClientPacmanController_1.ClientPacmanController.eventDash[eid] = 0;
        }
        else {
            // just do normal movement
            P2Body_1.P2Body.velocity.x[eid] = velX / length * PACMAN_SPEED;
            P2Body_1.P2Body.velocity.y[eid] = velY / length * PACMAN_SPEED;
        }
        // set body angle
        P2Body_1.P2Body.angle[eid] = angle;
    }
    else {
        // if we got here just stop moving
        P2Body_1.P2Body.velocity.x[eid] = 0;
        P2Body_1.P2Body.velocity.y[eid] = 0;
        ClientPacmanController_1.ClientPacmanController.eventDash[eid] = 0;
    }
};
const handleDashing = (eid, dt_ms) => {
    ClientPacmanController_1.ClientPacmanController.dashTime[eid] -= dt_ms * 0.001;
    if (ClientPacmanController_1.ClientPacmanController.dashTime[eid] <= 0) {
        ClientPacmanController_1.ClientPacmanController.state[eid] = ClientPacmanController_1.ClientPacmanState.Roaming;
        ClientPacmanController_1.ClientPacmanController.dashCooldown[eid] = 1;
    }
};
const handleKnocked = (eid, dt_ms) => {
    ClientPacmanController_1.ClientPacmanController.knockedTIme[eid] -= dt_ms * 0.001;
    if (ClientPacmanController_1.ClientPacmanController.knockedTIme[eid] <= 0) {
        ClientPacmanController_1.ClientPacmanController.state[eid] = ClientPacmanController_1.ClientPacmanState.Roaming;
    }
};
const handlePacmanContact = (eid) => {
    // if the other pacman was dashing we need to go into knocked state
    const otherEid = ClientPacmanController_1.ClientPacmanController.eventPacmanContactEid[eid];
    if (ClientPacmanController_1.ClientPacmanController.state[otherEid] === ClientPacmanController_1.ClientPacmanState.Dashing && ClientPacmanController_1.ClientPacmanController.state[eid] !== ClientPacmanController_1.ClientPacmanState.Dashing) {
        ClientPacmanController_1.ClientPacmanController.state[eid] = ClientPacmanController_1.ClientPacmanState.Knocked;
        let x = P2Body_1.P2Body.position.x[otherEid] - P2Body_1.P2Body.position.x[eid];
        let y = P2Body_1.P2Body.position.y[otherEid] - P2Body_1.P2Body.position.y[eid];
        let l = Math.sqrt(x ** 2 + y ** 2);
        x /= l;
        y /= l;
        P2Body_1.P2Body.applyForce.x[eid] = x * 5000;
        P2Body_1.P2Body.applyForce.y[eid] = y * 5000;
        P2Body_1.P2Body.applyForce.activate[eid] = 1;
        ClientPacmanController_1.ClientPacmanController.knockedTIme[eid] = 0.5;
    }
};
