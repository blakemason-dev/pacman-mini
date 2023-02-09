"use strict";
// GameObjectSyncSystem.ts
//  - Syncs all room game objects with ECS objects
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameObjectSyncSystem = void 0;
const bitecs_1 = require("bitecs");
const sGameObject_1 = require("../../types/sGameObject");
const ClientPacmanController_1 = require("../components/ClientPacmanController");
const Color_1 = require("../components/Color");
const GameObjectSync_1 = require("../components/GameObjectSync");
const P2Body_1 = require("../components/P2Body");
const createGameObjectSyncSystem = (gameObjects) => {
    // create queries
    const syncQuery = (0, bitecs_1.defineQuery)([GameObjectSync_1.GameObjectSync, P2Body_1.P2Body]);
    const syncQueryEnter = (0, bitecs_1.enterQuery)(syncQuery);
    const syncQueryExit = (0, bitecs_1.exitQuery)(syncQuery);
    return (0, bitecs_1.defineSystem)((ecsWorld) => {
        const syncs = syncQuery(ecsWorld);
        syncs.map(eid => {
            // grab the new transform data
            const x = P2Body_1.P2Body.position.x[eid];
            const y = P2Body_1.P2Body.position.y[eid];
            const angle = P2Body_1.P2Body.angle[eid];
            // find out type of object and sync data accordingly
            const go = gameObjects.get(eid.toString());
            if (go) {
                switch (go.type) {
                    case sGameObject_1.GameObjectType.Pacman: {
                        const pacman = go;
                        pacman.position.x = x;
                        pacman.position.y = y;
                        pacman.angle = angle;
                        pacman.color = Color_1.Color.hexCode[eid];
                        pacman.score = ClientPacmanController_1.ClientPacmanController.score[eid];
                        break;
                    }
                    case sGameObject_1.GameObjectType.MiniPacman: {
                        const miniPacman = go;
                        miniPacman.position.x = x;
                        miniPacman.position.y = y;
                        miniPacman.angle = angle;
                        miniPacman.color = Color_1.Color.hexCode[eid];
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        });
        return ecsWorld;
    });
};
exports.createGameObjectSyncSystem = createGameObjectSyncSystem;
