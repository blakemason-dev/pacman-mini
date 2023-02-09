"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPfPortal = void 0;
const bitecs_1 = require("bitecs");
const sPortal_1 = require("../../types/sPortal");
const MiniPacmanRescueZone_1 = require("../components/MiniPacmanRescueZone");
const P2Body_1 = require("../components/P2Body");
const P2ShapeCircle_1 = require("../components/P2ShapeCircle");
const createPfPortal = (world, gos, x, y, radius) => {
    const eid = (0, bitecs_1.addEntity)(world);
    gos.set(eid.toString(), new sPortal_1.sPortal(x, y, radius));
    // Set ECS components
    (0, bitecs_1.addComponent)(world, P2Body_1.P2Body, eid);
    P2Body_1.P2Body.mass[eid] = 0;
    P2Body_1.P2Body.type[eid] = 0;
    P2Body_1.P2Body.position.x[eid] = x;
    P2Body_1.P2Body.position.y[eid] = y;
    P2Body_1.P2Body.angle[eid] = 0;
    P2Body_1.P2Body.collisionResponse[eid] = 0;
    (0, bitecs_1.addComponent)(world, P2ShapeCircle_1.P2ShapeCircle, eid);
    P2ShapeCircle_1.P2ShapeCircle.radius[eid] = radius;
    (0, bitecs_1.addComponent)(world, MiniPacmanRescueZone_1.MiniPacmanRescueZone, eid);
    // don't need sync for static objects
    // addComponent(world, GameObjectSync, eid); 
    return eid;
};
exports.createPfPortal = createPfPortal;
