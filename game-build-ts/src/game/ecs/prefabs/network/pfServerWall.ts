import {
    addEntity,
    addComponent,
    IWorld,
    removeComponent,
    removeEntity
} from 'bitecs';

import * as AssetLibrary from '../../libraries/AssetLibrary';
import { Image } from '../../components/Image';
import { Transform } from '../../components/Transform';
// import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { sGameObject } from '../../../../../../game-server/src/types/sGameObject';
import { sWall } from '../../../../../../game-server/src/types/sWall';

export const createPfServerWall = (
    world: IWorld, 
    serverEid: number, 
    go: sGameObject) => {

    const eid = addEntity(world);
    const goWall = go as sWall;

    addComponent(world, Image, eid);
    Image.textureIndex[eid] = AssetLibrary.getIndex('white-pixel');
    Image.width[eid] = goWall.width;
    Image.height[eid] = goWall.height;
    Image.origin.x[eid] = 0.5;
    Image.origin.y[eid] = 0.5;
    Image.depth[eid] = 0;
    Image.tint[eid] = 0xffffff;
    Image.alpha[eid] = 1;

    addComponent(world, Transform, eid);
    Transform.position.x[eid] = goWall.position.x;
    Transform.position.y[eid] = goWall.position.y;

    // addComponent(world, ServerGameObjectSync, eid);
    // ServerGameObjectSync.serverEid[eid] = serverEid;

    return eid;
}

export const destroyPfServerWall = (world: IWorld, eid: number) => {
    removeComponent(world, Image, eid);
    removeComponent(world, Transform, eid);
    removeEntity(world, eid);
}