"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyPfMiniPacman = exports.createPfMiniPacman = void 0;
const bitecs_1 = require("bitecs");
const GameObjectSync_1 = require("../components/GameObjectSync");
const P2Body_1 = require("../components/P2Body");
const P2ShapeCircle_1 = require("../components/P2ShapeCircle");
const sMiniPacman_1 = require("../../types/sMiniPacman");
const MiniPacmanController_1 = require("../components/MiniPacmanController");
const Color_1 = require("../components/Color");
const createPfMiniPacman = (world, gos, x, y, color = 0xffcc00) => {
    const eid = (0, bitecs_1.addEntity)(world);
    gos.set(eid.toString(), new sMiniPacman_1.sMiniPacman(eid, x, y));
    (0, bitecs_1.addComponent)(world, P2Body_1.P2Body, eid);
    P2Body_1.P2Body.mass[eid] = 0.05;
    P2Body_1.P2Body.type[eid] = 1; // 0 = static, 1 = dynamic, 2 = kinematic
    P2Body_1.P2Body.position.x[eid] = x;
    P2Body_1.P2Body.position.y[eid] = y;
    P2Body_1.P2Body.angle[eid] = 0;
    P2Body_1.P2Body.collisionResponse[eid] = 1;
    (0, bitecs_1.addComponent)(world, P2ShapeCircle_1.P2ShapeCircle, eid);
    P2ShapeCircle_1.P2ShapeCircle.radius[eid] = 0.25;
    // need to add offset code
    (0, bitecs_1.addComponent)(world, Color_1.Color, eid);
    Color_1.Color.hexCode[eid] = color;
    // add an NPC movement component here
    (0, bitecs_1.addComponent)(world, MiniPacmanController_1.MiniPacmanController, eid);
    (0, bitecs_1.addComponent)(world, GameObjectSync_1.GameObjectSync, eid);
    return eid;
};
exports.createPfMiniPacman = createPfMiniPacman;
const destroyPfMiniPacman = (world, eid, gos) => {
    (0, bitecs_1.removeComponent)(world, P2Body_1.P2Body, eid);
    (0, bitecs_1.removeComponent)(world, P2ShapeCircle_1.P2ShapeCircle, eid);
    (0, bitecs_1.removeComponent)(world, Color_1.Color, eid);
    (0, bitecs_1.removeComponent)(world, MiniPacmanController_1.MiniPacmanController, eid);
    (0, bitecs_1.removeComponent)(world, GameObjectSync_1.GameObjectSync, eid);
    gos.delete(eid.toString());
};
exports.destroyPfMiniPacman = destroyPfMiniPacman;
