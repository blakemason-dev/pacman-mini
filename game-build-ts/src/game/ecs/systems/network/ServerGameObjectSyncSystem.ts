import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
} from 'bitecs';

import { GameObjectType } from '../../../../../../game-server/src/types/sGameObject';
import { sPacman } from '../../../../../../game-server/src/types/sPacman';
import { sBackground } from '../../../../../../game-server/src/types/sBackground';
import GameServerHandler from '../../../services/GameServerHandler';
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { Transform } from '../../components/Transform';
import { Size } from '../../components/Size';


export const createServerGameObjectSyncSystem = (server: GameServerHandler) => {

    const syncerQuery = defineQuery([ServerGameObjectSync]);
    const syncerQueryEnter = enterQuery(syncerQuery);
    const syncerQueryExit = exitQuery(syncerQuery);

    const room = server.room;
    const events = server.events;

    let prev_ms = Date.now();

    return defineSystem((world: IWorld) => {
        if (!room) return world;

        // if state change, make sure we tell component it needs to update
        const enterSyncers = syncerQueryEnter(world);
        enterSyncers.map(eid => {
            events.on('state-changed', state => {
                const sgoEid = ServerGameObjectSync.serverEid[eid];
                const sgo = state.gameObjects.get(sgoEid.toString());

                if (sgo) {
                    switch (sgo.type) {
                        case GameObjectType.Pacman: {
                            Transform.position.x[eid] = (sgo as sPacman).position.x;
                            Transform.position.y[eid] = (sgo as sPacman).position.y;
                            Transform.rotation[eid] = (sgo as sPacman).angle;
                            break;
                        }
                        // case GameObjectType.Background: {
                        //     Transform.position.x[eid] = (sgo as sBackground).position.x;
                        //     Transform.position.y[eid] = (sgo as sBackground).position.y;
                        //     Size.width[eid] = (sgo as sBackground).width;
                        //     Size.height[eid] = (sgo as sBackground).height;
                        //     break;
                        // }
                        default: break;
                    }
                }

            });
        });

        return world;
    })
}