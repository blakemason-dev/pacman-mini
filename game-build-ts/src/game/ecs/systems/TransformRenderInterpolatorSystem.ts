import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    hasComponent,
} from 'bitecs';
import { iServerGameConfig } from '../../../../../game-server/src/types/iServerGameConfig';


import GameServerHandler from '../../services/GameServerHandler';
import { Transform } from '../components/Transform';
import { TransformRenderInterpolator } from '../components/TransformRenderInterpolator';

const shortAngleDist = (a0: number, a1: number) => {
    var max = Math.PI*2;
    var da = (a1 - a0) % max;
    return 2*da % max - da;
}

const angleLerp = (a0: number, a1: number, dt: number) => {
    return a0 + shortAngleDist(a0, a1)*dt;
}

export const createTransformRenderInterpolatorSystem = (server: GameServerHandler, serverGameConfig: iServerGameConfig, ecsWorld: IWorld) => {

    const interpQuery = defineQuery([Transform, TransformRenderInterpolator]);
    const interpQueryEnter = enterQuery(interpQuery);
    const interpQueryExit = exitQuery(interpQuery);

    const room = server.room;
    const events = server.events;

    // create one off listeners
    events.on('state-changed', state => {
        const eids = interpQuery(ecsWorld);
        eids.map(eid => {
            if (hasComponent(ecsWorld, TransformRenderInterpolator, eid)) {
                TransformRenderInterpolator.previous.position.x[eid] = TransformRenderInterpolator.current.position.x[eid];
                TransformRenderInterpolator.previous.position.y[eid] = TransformRenderInterpolator.current.position.y[eid];
                TransformRenderInterpolator.previous.rotation[eid] = TransformRenderInterpolator.current.rotation[eid];
        
                TransformRenderInterpolator.current.position.x[eid] = Transform.position.x[eid];
                TransformRenderInterpolator.current.position.y[eid] = Transform.position.y[eid];
                TransformRenderInterpolator.current.rotation[eid] = Transform.rotation[eid];
        
                TransformRenderInterpolator.accum[eid] = 0;
            }
        })
    });

    // for time keeping
    let previous_ms = Date.now();
    
    // define the system
    return defineSystem((world: IWorld) => {
        if (!room) return world;

        const current_ms = Date.now();
        const dt_ms = current_ms - previous_ms;
        previous_ms = current_ms;

        const enterInterps = interpQueryEnter(world);
        enterInterps.map(eid => {
            TransformRenderInterpolator.previous.position.x[eid] = Transform.position.x[eid];
            TransformRenderInterpolator.previous.position.y[eid] = Transform.position.y[eid];
            TransformRenderInterpolator.previous.rotation[eid] = Transform.rotation[eid];

            TransformRenderInterpolator.current.position.x[eid] = Transform.position.x[eid];
            TransformRenderInterpolator.current.position.y[eid] = Transform.position.y[eid];
            TransformRenderInterpolator.current.rotation[eid] = Transform.rotation[eid];
        });

        const interps = interpQuery(world); 
        interps.map(eid => {

            TransformRenderInterpolator.accum[eid] += dt_ms;
            let interp = TransformRenderInterpolator.accum[eid] / (1000 / serverGameConfig.updateFps);
            if (interp > 1) interp = 1;

            TransformRenderInterpolator.interp.position.x[eid] = TransformRenderInterpolator.previous.position.x[eid] + interp * (TransformRenderInterpolator.current.position.x[eid] - TransformRenderInterpolator.previous.position.x[eid]);
            TransformRenderInterpolator.interp.position.y[eid] = TransformRenderInterpolator.previous.position.y[eid] + interp * (TransformRenderInterpolator.current.position.y[eid] - TransformRenderInterpolator.previous.position.y[eid]);
            TransformRenderInterpolator.interp.rotation[eid] = 
                angleLerp(TransformRenderInterpolator.previous.rotation[eid], TransformRenderInterpolator.current.rotation[eid], interp);
        });

        return world;
    })
}