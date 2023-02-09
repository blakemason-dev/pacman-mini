"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPfWall = void 0;
const bitecs_1 = require("bitecs");
const sWall_1 = require("../../types/sWall");
const P2Body_1 = require("../components/P2Body");
const P2ShapeBox_1 = require("../components/P2ShapeBox");
const createPfWall = (world, gos, x, y, width, height) => {
    const eid = (0, bitecs_1.addEntity)(world);
    // Set ECS components
    (0, bitecs_1.addComponent)(world, P2Body_1.P2Body, eid);
    P2Body_1.P2Body.mass[eid] = 0;
    P2Body_1.P2Body.type[eid] = 0;
    P2Body_1.P2Body.position.x[eid] = x;
    P2Body_1.P2Body.position.y[eid] = y;
    P2Body_1.P2Body.angle[eid] = 0;
    P2Body_1.P2Body.collisionResponse[eid] = 1;
    (0, bitecs_1.addComponent)(world, P2ShapeBox_1.P2ShapeBox, eid);
    P2ShapeBox_1.P2ShapeBox.width[eid] = width;
    P2ShapeBox_1.P2ShapeBox.height[eid] = height;
    // Set room gameobject
    gos.set(eid.toString(), new sWall_1.sWall(x, y, width, height));
    // don't need sync for static objects
    // addComponent(world, GameObjectSync, eid);
    return eid;
};
exports.createPfWall = createPfWall;
