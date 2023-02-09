"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMiniPacmanRescueZoneSystem = void 0;
const bitecs_1 = require("bitecs");
const MiniPacmanRescueZone_1 = require("../components/MiniPacmanRescueZone");
const createMiniPacmanRescueZoneSystem = (gameObjects) => {
    // create queries
    const rescuerQuery = (0, bitecs_1.defineQuery)([MiniPacmanRescueZone_1.MiniPacmanRescueZone]);
    const rescuerQueryEnter = (0, bitecs_1.enterQuery)(rescuerQuery);
    const rescuerQueryExit = (0, bitecs_1.exitQuery)(rescuerQuery);
    return (0, bitecs_1.defineSystem)((ecsWorld) => {
        const enterRescuers = rescuerQueryEnter(ecsWorld);
        enterRescuers.map(eid => {
        });
        return ecsWorld;
    });
};
exports.createMiniPacmanRescueZoneSystem = createMiniPacmanRescueZoneSystem;
