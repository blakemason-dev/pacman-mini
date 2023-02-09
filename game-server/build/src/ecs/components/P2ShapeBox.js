"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2ShapeBox = void 0;
const bitecs_1 = require("bitecs");
exports.P2ShapeBox = (0, bitecs_1.defineComponent)({
    width: bitecs_1.Types.f32,
    height: bitecs_1.Types.f32,
    offset: {
        x: bitecs_1.Types.f32,
        y: bitecs_1.Types.f32,
    }
});
