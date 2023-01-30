import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../../libraries/AssetLibrary';
import { Image } from '../../components/Image';
import { Transform } from '../../components/Transform';
// import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { sGameObject } from '../../../../../../game-server/src/types/sGameObject';
import { sPortal } from '../../../../../../game-server/src/types/sPortal';
import { Circle } from '../../components/Circle';

export const createPfServerPortal = (
    world: IWorld, 
    go: sGameObject,
    serverEid: number) => {

    const eid = addEntity(world);
    const goPortal = go as sPortal;

    addComponent(world, Circle, eid);
    // Circle.x[eid] = goPortal.position.x;
    // Circle.y[eid] = goPortal.position.y;
    Circle.radius[eid] = goPortal.radius;
    Circle.fillColor[eid] = 0x00ff00;
    Circle.fillAlpha[eid] = 1;

    addComponent(world, Transform, eid);
    Transform.position.x[eid] = goPortal.position.x;
    Transform.position.y[eid] = goPortal.position.y;

    // addComponent(world, ServerGameObjectSync, eid);
    // ServerGameObjectSync.serverEid[eid] = serverEid;

    return eid;
}
