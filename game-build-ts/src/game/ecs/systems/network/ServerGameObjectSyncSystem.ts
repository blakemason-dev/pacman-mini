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
import { iPacmanMiniState } from '../../../../../../game-server/src/types/iPacmanMiniState';
import GameServerHandler from '../../../services/GameServerHandler';
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { Transform } from '../../components/Transform';
import { sMiniPacman } from '../../../../../../game-server/src/types/sMiniPacman';
import { Image } from '../../components/Image';


export const createServerGameObjectSyncSystem = (server: GameServerHandler, ecsWorld: IWorld) => {

    const syncerQuery = defineQuery([ServerGameObjectSync]);
    const syncerQueryEnter = enterQuery(syncerQuery);
    const syncerQueryExit = exitQuery(syncerQuery);

    const room = server.room;
    const events = server.events;

    // create one off listeners
    const eids = syncerQuery(ecsWorld);
    events.on('state-changed', state => {
    // events.on('update-game-state', (state: iPacmanMiniState) => {
        eids.map(eid => {
            const sgoEid = ServerGameObjectSync.serverEid[eid];
            const sgo = state.gameObjects.get(sgoEid.toString());

            if (sgo) {
                switch (sgo.type) {
                    case GameObjectType.Pacman: {
                        Transform.position.x[eid] = (sgo as sPacman).position.x;
                        Transform.position.y[eid] = (sgo as sPacman).position.y;
                        Transform.rotation[eid] = (sgo as sPacman).angle;
                        Image.tint[eid] = (sgo as sPacman).color;
                        // update scores
                        if (Image.tint[eid] === 0xff0000) {
                            events.emit('updateRedScore', (sgo as sPacman).score);
                        } else if (Image.tint[eid] === 0x0000ff) {
                            events.emit('updateBlueScore', (sgo as sPacman).score);
                        }
                        break;
                    }
                    case GameObjectType.MiniPacman: {
                        Transform.position.x[eid] = (sgo as sMiniPacman).position.x;
                        Transform.position.y[eid] = (sgo as sMiniPacman).position.y;
                        Transform.rotation[eid] = (sgo as sMiniPacman).angle;
                        Image.tint[eid] = (sgo as sMiniPacman).color;
                        // console.log(Image.tint[eid]);
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

    return defineSystem((world: IWorld) => {
        if (!room) return world;

        // if state change, make sure we tell component it needs to update
        const enterSyncers = syncerQueryEnter(world);
        enterSyncers.map(eid => {

        });

        return world;
    })
}