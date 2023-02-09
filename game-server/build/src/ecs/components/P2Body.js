"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2Body = void 0;
const bitecs_1 = require("bitecs");
exports.P2Body = (0, bitecs_1.defineComponent)({
    type: bitecs_1.Types.ui8,
    mass: bitecs_1.Types.f32,
    position: {
        x: bitecs_1.Types.f32,
        y: bitecs_1.Types.f32
    },
    velocity: {
        x: bitecs_1.Types.f32,
        y: bitecs_1.Types.f32
    },
    angle: bitecs_1.Types.f32,
    collisionResponse: bitecs_1.Types.ui8,
    // "methods"
    applyForce: {
        activate: bitecs_1.Types.ui8,
        x: bitecs_1.Types.f32,
        y: bitecs_1.Types.f32,
    }
});
