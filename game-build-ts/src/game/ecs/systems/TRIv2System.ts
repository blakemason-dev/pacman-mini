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
import { Transform } from '../components/Transform';
import { TransformRenderInterpolator } from '../components/TransformRenderInterpolator';
import { NUM_BUFFER, TRIv2 } from '../components/TRIv2';

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

export const createTRIv2System = (server: GameServerHandler, serverGameConfig: iServerGameConfig, ecsWorld: IWorld) => {

    const buffer = new Map<number, Snapshot[]>();

    const interpQuery = defineQuery([Transform, TRIv2]);
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
                buff.push({
                    position: {
                        x: Transform.position.x[eid],
                        y: Transform.position.y[eid]
                    },
                    rotaton: Transform.rotation[eid],
                    timeStamp: state.serverTime,
                });

                if (buff.length > NUM_BUFFER) {
                    buff.shift();
                }
            }

            // TRIv2.positionX[eid].set([...TRIv2.positionX[eid].slice(1, NUM_BUFFER), Transform.position.x[eid]]);
            // TRIv2.positionY[eid].set([...TRIv2.positionY[eid].slice(1, NUM_BUFFER), Transform.position.y[eid]]);
            // TRIv2.rotation[eid].set([...TRIv2.rotation[eid].slice(1, NUM_BUFFER), Transform.rotation[eid]]);
            // TRIv2.timeStamp[eid].set([...TRIv2.timeStamp[eid].slice(1, NUM_BUFFER), state.serverTime]);

            // console.log(TRIv2.timeStamp[eid]);

            // for (let i = 0; i < NUM_BUFFER-1; i++) {
            //     TRIv2.positionX[i][eid] = TRIv2.positionX[i+1][eid];
            //     TRIv2.positionY[i][eid] = TRIv2.positionY[i+1][eid];
            //     TRIv2.rotation[i][eid] = TRIv2.rotation[i+1][eid];
            //     TRIv2.timeStamp[i][eid] = TRIv2.timeStamp[i+1][eid];
            // }
            // TRIv2.positionX[NUM_BUFFER-1][eid] = Transform.position.x[eid];
            // TRIv2.positionY[NUM_BUFFER-1][eid] = Transform.position.y[eid];
            // TRIv2.rotation[NUM_BUFFER-1][eid] = Transform.rotation[eid];
            // TRIv2.positionX[NUM_BUFFER-1][eid] = state.serverTime;
        });

        // console.log(state.serverTime, clientTime);
    });


    // define the system
    return defineSystem((world: IWorld) => {
        if (!room) return world;

        const current_ms = Date.now();
        const dt_ms = current_ms - previous_ms;
        previous_ms = current_ms;

        // update client time
        clientTime += dt_ms;
        // console.log(clientTime);

        const enterInterps = interpQueryEnter(world);
        enterInterps.map(eid => {
            buffer.set(eid, []);
        });

        // UPDATE
        const interps = interpQuery(world);
        // console.log(interps.length);
        interps.map(eid => {
            // find frames we're closest to
            let prev = 0;
            let curr = NUM_BUFFER - 1;
            let done = false;

            const buff = buffer.get(eid);

            if (buff) {
                buff.forEach((val, idx, arr) => {
                    console.log(buff[idx].timeStamp);
                    if (!done) {
                        if (clientTime < val.timeStamp) {
                            prev = idx;
                        } else {
                            curr = idx;
                            done = true;
                        }
                    }
                });

                if (buff[prev] && buff[curr]) {
                    
                    let lerp = (clientTime - buff[prev].timeStamp) / (buff[curr].timeStamp - buff[prev].timeStamp);
                    console.log(buff[curr].timeStamp, buff[prev].timeStamp);
                    
                    // TRIv2.render.position.x[eid] = dimensionLerp(prevPosX, currPosX, lerp);
                    // TRIv2.render.position.y[eid] = dimensionLerp(prevPosY, currPosY, lerp);
                    // TRIv2.render.rotation[eid] = angleLerp(prevRot, currRot, lerp);
                    // }
                }

            }
        });

        return world;
    })
}