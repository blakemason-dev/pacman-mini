"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPfClientPacman = void 0;
const bitecs_1 = require("bitecs");
const sPacman_1 = require("../../types/sPacman");
const ClientPacmanController_1 = require("../components/ClientPacmanController");
const Color_1 = require("../components/Color");
const GameObjectSync_1 = require("../components/GameObjectSync");
const P2Body_1 = require("../components/P2Body");
const P2ShapeCircle_1 = require("../components/P2ShapeCircle");
const createPfClientPacman = (world, gos, sessionId, x, y, color = 0xffcc00) => {
    const eid = (0, bitecs_1.addEntity)(world);
    gos.set(eid.toString(), new sPacman_1.sPacman(sessionId, x, y));
    (0, bitecs_1.addComponent)(world, P2Body_1.P2Body, eid);
    P2Body_1.P2Body.mass[eid] = 5000;
    P2Body_1.P2Body.type[eid] = 1; // 0 = static, 1 = dynamic, 2 = kinematic
    P2Body_1.P2Body.position.x[eid] = x;
    P2Body_1.P2Body.position.y[eid] = y;
    P2Body_1.P2Body.angle[eid] = 0;
    P2Body_1.P2Body.collisionResponse[eid] = 1;
    (0, bitecs_1.addComponent)(world, P2ShapeCircle_1.P2ShapeCircle, eid);
    P2ShapeCircle_1.P2ShapeCircle.radius[eid] = 0.5;
    // need to add offset code
    (0, bitecs_1.addComponent)(world, Color_1.Color, eid);
    Color_1.Color.hexCode[eid] = color;
    (0, bitecs_1.addComponent)(world, ClientPacmanController_1.ClientPacmanController, eid);
    (0, bitecs_1.addComponent)(world, GameObjectSync_1.GameObjectSync, eid);
    return eid;
};
exports.createPfClientPacman = createPfClientPacman;
