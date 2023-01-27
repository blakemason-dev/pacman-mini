import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
} from 'bitecs';

import { GameObjectType } from '../../../../../../game-server/src/types/sGameObject';
import { sPacman } from '../../../../../../game-server/src/types/sPacman';
import GameServerHandler from '../../../services/GameServerHandler';
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { Transform } from '../../components/Transform';

export const createServerGameObjectSyncSystem = (server: GameServerHandler) => {

    const syncerQuery = defineQuery([ServerGameObjectSync]);
    const syncerQueryEnter = enterQuery(syncerQuery);
    const syncerQueryExit = exitQuery(syncerQuery);

    const room = server.room;

    return defineSystem((world: IWorld) => {
        if (!room) return world;

        const syncers = syncerQuery(world);
        syncers.map(eid => {
            const sgoEid = ServerGameObjectSync.serverEid[eid];
            const sgo = room.state.gameObjects.get(sgoEid.toString());
            
            if (sgo) {
                switch (sgo.type) {
                    case GameObjectType.Pacman: {
                        Transform.position.x[eid] = (sgo as sPacman).position.x;
                        Transform.position.y[eid] = (sgo as sPacman).position.y;
                        Transform.rotation[eid] = (sgo as sPacman).angle;
                        break;  
                    }
                    default: break;
                }
            }
        });
        
        return world;
    })
}