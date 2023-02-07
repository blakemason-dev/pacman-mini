import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    removeComponent,
} from 'bitecs';

import { GameObjectType, sGameObject } from '../../../../../../game-server/src/types/sGameObject';
import { sPacman } from '../../../../../../game-server/src/types/sPacman';
import { sBackground } from '../../../../../../game-server/src/types/sBackground';
import { iPacmanMiniState } from '../../../../../../game-server/src/types/iPacmanMiniState';
import GameServerHandler from '../../../services/GameServerHandler';
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { Transform } from '../../components/Transform';
import { sMiniPacman } from '../../../../../../game-server/src/types/sMiniPacman';
import { Image } from '../../components/Image';
import { ServerMiniPacmanController, ServerMiniPacmanState } from '../../components/network/ServerMiniPacmanController';
import { createPfServerMiniPacman, destroyPfServerMiniPacman } from '../../prefabs/network/pfServerMiniPacman';
import { SnapshotInterpolation } from '../../components/SnapshotInterpolation';


export const createServerMiniPacmanControllerSystem = (server: GameServerHandler, ecsWorld: IWorld, portalEid: number) => {
    const minisByServerEid = new Map<number, number>();

    const controllerQuery = defineQuery([ServerMiniPacmanController]);
    const controllerQueryEnter = enterQuery(controllerQuery);
    const controllerQueryExit = exitQuery(controllerQuery);

    const room = server.room;
    const events = server.events;

    // create one off listeners
    events.on('mini-pacman-saved', (goMiniPacman: sMiniPacman) => {
        // search our map for the correct server eid
        minisByServerEid.forEach((val, key) => {
            console.log(val, goMiniPacman.serverEid);
            if (goMiniPacman.serverEid === val) {
                ServerMiniPacmanController.state[key] = ServerMiniPacmanState.ClientControl;
                // grab final position
                Transform.position.x[key] = SnapshotInterpolation.render.position.x[key];
                Transform.position.y[key] = SnapshotInterpolation.render.position.y[key];
                Transform.rotation[key] = SnapshotInterpolation.render.rotation[key];
                removeComponent(ecsWorld, SnapshotInterpolation, key);
                ServerMiniPacmanController.savedPosition.x[key] = Transform.position.x[key];
                ServerMiniPacmanController.savedPosition.y[key] = Transform.position.y[key];
            }
        });
    });

    let previous_ms = Date.now();

    return defineSystem((world: IWorld) => {
        if (!room) return world;

        // time keeping
        const current_ms = Date.now();
        const dt_ms = current_ms - previous_ms;
        previous_ms = current_ms;

        // ENTER
        const enterMiniPacmen = controllerQueryEnter(world);
        enterMiniPacmen.map(eid => {
            minisByServerEid.set(eid, ServerGameObjectSync.serverEid[eid]);
        });

        // UPDATE
        const updateMiniPacmen = controllerQuery(world);
        updateMiniPacmen.map(eid => {
            switch (ServerMiniPacmanController.state[eid]) {
                case ServerMiniPacmanState.ServerControl: {
                    // do nothing, let server control
                    break;
                }
                case ServerMiniPacmanState.ClientControl: {
                    // move to centre of portal and fade out
                    const saveX = ServerMiniPacmanController.savedPosition.x[eid];
                    const saveY = ServerMiniPacmanController.savedPosition.x[eid];
                    const targX = Transform.position.x[portalEid];
                    const targY = Transform.position.y[portalEid];
                    const currX = Transform.position.x[eid];
                    const currY = Transform.position.y[eid];
                    const dirX = targX - currX;
                    const dirY = targY - currY;

                    let saveDist = Math.sqrt((targX-saveX)**2+(targY-saveY)**2);
                    let currDist = Math.sqrt((targX-currX)**2+(targY-currY)**2);
                    // let l = Math.sqrt(dirX**2 + dirY**2);

                    if (currDist < 0.05) {
                        destroyPfServerMiniPacman(world, eid);
                    }

                    Transform.position.x[eid] += dirX / currDist * dt_ms * 0.001 * 3;
                    Transform.position.y[eid] += dirY / currDist * dt_ms * 0.001 * 3;

                    Image.alpha[eid] = currDist/saveDist;
                }
            }
        });

        return world;
    })
}