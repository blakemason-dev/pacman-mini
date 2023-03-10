// TRIv2System.ts 
// Transform Render Interpolator version 2 System

import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    hasComponent,
} from 'bitecs';
import { iPacmanMiniState } from '../../../../../game-server/src/types/iPacmanMiniState';
import { iServerGameConfig } from '../../../../../game-server/src/types/iServerGameConfig';

import GameServerHandler from '../../services/GameServerHandler';
import { SnapshotInterpolation } from '../components/SnapshotInterpolation';
import { Transform } from '../components/Transform';

const shortAngleDist = (a0: number, a1: number) => {
    var max = Math.PI * 2;
    var da = (a1 - a0) % max;
    return 2 * da % max - da;
}

const angleLerp = (a0: number, a1: number, dt: number) => {
    return a0 + shortAngleDist(a0, a1) * dt;
}

const dimensionLerp = (a0: number, a1: number, dt: number) => {
    return a0 + dt * (a1 - a0);
}

interface Snapshot {
    position: {
        x: number,
        y: number,
    }
    rotaton: number,
    timeStamp: number,
}

const NUM_BUFFER = 10;

export const createSnapshotInterpolationSystem = (server: GameServerHandler, serverGameConfig: iServerGameConfig, ecsWorld: IWorld) => {

    const buffer = new Map<number, Snapshot[]>();

    const interpQuery = defineQuery([Transform, SnapshotInterpolation]);
    const interpQueryEnter = enterQuery(interpQuery);
    const interpQueryExit = exitQuery(interpQuery);

    const room = server.room;
    const events = server.events;

    let clientTime = serverGameConfig.timeStamp;

    // for time keeping
    let previous_ms = Date.now();

    // create one off listeners
    events.on('state-changed', (state: iPacmanMiniState) => {
        const eids = interpQuery(ecsWorld);
        eids.map(eid => {
            const buff = buffer.get(eid);
            if (buff) {
                const snapshot = {
                    position: {
                        x: Transform.position.x[eid],
                        y: Transform.position.y[eid]
                    },
                    rotaton: Transform.rotation[eid],
                    timeStamp: state.serverTime,
                }
                buff.push(snapshot);

                if (buff.length > NUM_BUFFER) {
                    buff.shift();
                }
            }
        });
    });


    // define the system
    return defineSystem((world: IWorld) => {
        if (!room) return world;

        // find delta time
        const current_ms = Date.now();
        const dt_ms = current_ms - previous_ms;
        previous_ms = current_ms;

        // update client time
        clientTime += dt_ms;

        // ENTER
        const enterInterps = interpQueryEnter(world);
        enterInterps.map(eid => {
            buffer.set(eid, []);
        });

        // UPDATE
        const interps = interpQuery(world);
        interps.map(eid => {
            // find frames we're closest to
            let prev = -1;
            let curr = -1;

            // go through the buffer array
            const buff = buffer.get(eid);
            if (buff) {
                curr = buff.findIndex((val) => {
                    return val.timeStamp > clientTime;
                });
                prev = curr - 1;

                if (prev === -1 || curr === -1) {
                    console.log('OUCH');
                }

                if (buff[prev] && buff[curr]) {
                    let lerp = (clientTime - buff[prev].timeStamp) / (buff[curr].timeStamp - buff[prev].timeStamp);
                    
                    SnapshotInterpolation.render.position.x[eid] = dimensionLerp(buff[prev].position.x, buff[curr].position.x, lerp);
                    SnapshotInterpolation.render.position.y[eid] = dimensionLerp(buff[prev].position.y, buff[curr].position.y, lerp);
                    SnapshotInterpolation.render.rotation[eid] = angleLerp(buff[prev].rotaton, buff[curr].rotaton, lerp);
                } 

                if (buff.length < NUM_BUFFER) {
                    SnapshotInterpolation.render.position.x[eid] = Transform.position.x[eid];
                    SnapshotInterpolation.render.position.y[eid] = Transform.position.y[eid];
                    SnapshotInterpolation.render.rotation[eid] = Transform.rotation[eid];
                    console.log('here');
                }
            }
        });

        return world;
    })
}