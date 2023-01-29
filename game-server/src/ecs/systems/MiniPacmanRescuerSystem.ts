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
import { MiniPacmanRescuer } from '../components/MiniPacmanRescuer';
import { P2Body } from '../components/P2Body';

export const createMiniPacmanRescuerSystem = (gameObjects: MapSchema<sGameObject>) => {
    // create queries
    const rescuerQuery = defineQuery([MiniPacmanRescuer]);
    const rescuerQueryEnter = enterQuery(rescuerQuery);
    const rescuerQueryExit = exitQuery(rescuerQuery);

    return defineSystem((ecsWorld: IWorld) => {
        const enterRescuers = rescuerQueryEnter(ecsWorld);
        enterRescuers.map(eid => {
            
        });

        return ecsWorld;
    })
}