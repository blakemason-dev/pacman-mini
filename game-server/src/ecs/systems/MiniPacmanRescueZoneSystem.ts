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
import { MiniPacmanRescueZone } from '../components/MiniPacmanRescueZone';
import { P2Body } from '../components/P2Body';

export const createMiniPacmanRescueZoneSystem = (gameObjects: MapSchema<sGameObject>) => {
    // create queries
    const rescuerQuery = defineQuery([MiniPacmanRescueZone]);
    const rescuerQueryEnter = enterQuery(rescuerQuery);
    const rescuerQueryExit = exitQuery(rescuerQuery);

    return defineSystem((ecsWorld: IWorld) => {
        const enterRescuers = rescuerQueryEnter(ecsWorld);
        enterRescuers.map(eid => {
            
        });

        return ecsWorld;
    })
}