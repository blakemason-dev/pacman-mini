// GameObjectSyncSystem.ts
//  - Syncs all room game objects with ECS objects

import { MapSchema } from '@colyseus/schema';
import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';

import { GameObjectType, sGameObject } from '../../types/sGameObject';
import { sPacman } from '../../types/sPacman';
import { GameObjectSync } from '../components/GameObjectSync';
import { P2Body } from '../components/P2Body';

export const createGameObjectSyncSystem = (gameObjects: MapSchema<sGameObject>) => {
    // create queries
    const syncQuery = defineQuery([GameObjectSync, P2Body]);
    const syncQueryEnter = enterQuery(syncQuery);
    const syncQueryExit = exitQuery(syncQuery);

    return defineSystem((ecsWorld: IWorld) => {
        const syncs = syncQuery(ecsWorld);
        syncs.map(eid => {
            // grab the new transform data
            const x = P2Body.position.x[eid];
            const y = P2Body.position.y[eid];
            const angle = P2Body.angle[eid];

            // find out type of object and sync data accordingly
            const go = gameObjects.get(eid.toString());
            if (go) {
                switch (go.type) {
                    case GameObjectType.Pacman: {
                        const pacman = go as sPacman;
                        pacman.position.x = x;
                        pacman.position.y = y;
                        pacman.angle = angle;
                        break;
                    }
                    default: {
                        break;
                    }
                }

            }
        });

        return ecsWorld;
    })
}