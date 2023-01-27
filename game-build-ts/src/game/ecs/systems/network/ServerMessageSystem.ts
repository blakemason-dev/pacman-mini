import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
} from 'bitecs';

import { Pacman } from '../../../../../server/types/iSumoPacmanState';
import { Transform } from '../../components/Transform';
import Server from '../../services/Server';
import { ServerPacmanController } from '../../components/network/ServerPacmanController';

export const createServerMessageSystem = (scene: Phaser.Scene, server: Server) => {

    const receiverQuery = defineQuery([ServerPacmanController]);
    const receiverQueryEnter = enterQuery(receiverQuery);
    const receiverQueryExit = exitQuery(receiverQuery);

    let numReceivers = 0;

    const room = server.room;

    return defineSystem((world: IWorld) => {
        // make sure we have a room
        if (!room) return world;

        // handle receiving messages from the server
        const enterReceivers = receiverQueryEnter(world);
        enterReceivers.map(eid => {
            // get first state of each pacman
            server.room?.state.pacmen.map((pacman: Pacman, index: number) => {
                if (ServerPacmanController.serverIndex[eid] === index) {
                    Transform.position.x[eid] = pacman.position.x;
                    Transform.position.y[eid] = pacman.position.y;
                    Transform.rotation[eid] = pacman.angle;
                }
            });

            // if this is very first time started, set the state-changed event on callback
            if (numReceivers === 0) {
                server.eventEmitter.on('state-changed', (state) => {
                    state.pacmen.map((pacman: Pacman, index: number) => {
                        if (ServerPacmanController.serverIndex[eid] === index) {
                            Transform.position.x[eid] = pacman.position.x;
                            Transform.position.y[eid] = pacman.position.y;
                            Transform.rotation[eid] = pacman.angle;
                        }
                    })
                });
            }
        });
        
        return world;
    })
}