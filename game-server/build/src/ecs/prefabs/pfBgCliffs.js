"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPfBgCliffs = void 0;
const bitecs_1 = require("bitecs");
const sBackground_1 = require("../../types/sBackground");
const createPfBgCliffs = (world, gos) => {
    const eid = (0, bitecs_1.addEntity)(world);
    gos.set(eid.toString(), new sBackground_1.sBackground(30 * 16 / 9, 30));
    return eid;
};
exports.createPfBgCliffs = createPfBgCliffs;
