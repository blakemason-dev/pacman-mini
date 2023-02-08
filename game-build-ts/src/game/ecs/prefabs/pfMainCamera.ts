import {
    addEntity,
    addComponent,
    IWorld,
    removeComponent,
    removeEntity
} from 'bitecs';

import { MainCamera } from '../components/MainCamera';
import { Transform } from '../components/Transform';

export const createPfMainCamera = (world: IWorld, followEntityEid: number) => {
    const eid = addEntity(world);

    addComponent(world, MainCamera, eid);
    MainCamera.followEntity[eid] = followEntityEid;
    MainCamera.followLerp[eid] = 0.1;

    addComponent(world, Transform, eid);
    Transform.position.x[eid] = 0;
    Transform.position.y[eid] = 0;

    return eid;
}

export const destroyPfMainCamera = (world: IWorld, eid: number) => {
    removeComponent(world, MainCamera, eid);
    removeComponent(world, Transform, eid);
    removeEntity(world, eid);
}
