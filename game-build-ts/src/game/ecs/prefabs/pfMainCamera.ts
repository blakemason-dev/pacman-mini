import {
    addEntity,
    addComponent,
    IWorld
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
