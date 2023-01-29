import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../../libraries/AssetLibrary';
import { Image } from '../../components/Image';
import { Transform } from '../../components/Transform';
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { sGameObject } from '../../../../../../game-server/src/types/sGameObject';
import { sBackground } from '../../../../../../game-server/src/types/sBackground';

export const createPfServerCliffArea = (
    world: IWorld, 
    serverEid: number, 
    go: sGameObject) => {

    const eid = addEntity(world);
    const goBg = go as sBackground;

    addComponent(world, Image, eid);
    Image.textureIndex[eid] = AssetLibrary.getIndex('bg-cliff-area');
    Image.width[eid] = goBg.width;
    Image.height[eid] = goBg.height;
    Image.origin.x[eid] = 0.5;
    Image.origin.y[eid] = 0.5;
    Image.depth[eid] = 0;

    addComponent(world, Transform, eid);
    Transform.position.x[eid] = 0;
    Transform.position.y[eid] = 0;

    addComponent(world, ServerGameObjectSync, eid);
    ServerGameObjectSync.serverEid[eid] = serverEid;

    return eid;
}
