import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../../libraries/AssetLibrary';
import { Image } from '../../components/Image';
import { Transform } from '../../components/Transform';
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { TransformRenderInterpolator } from '../../components/TransformRenderInterpolator';

export const createPfServerPacman = (world: IWorld, serverEid: number) => {
    const eid = addEntity(world);

    addComponent(world, Image, eid);
    Image.textureIndex[eid] = AssetLibrary.getIndex('yellow-pacman');
    Image.width[eid] = 1;
    Image.height[eid] = 1;
    Image.origin.x[eid] = 0.5;
    Image.origin.y[eid] = 0.5;
    Image.depth[eid] = 1;

    addComponent(world, Transform, eid);
    Transform.position.x[eid] = 0;
    Transform.position.y[eid] = 0;

    addComponent(world, ServerGameObjectSync, eid);
    ServerGameObjectSync.serverEid[eid] = serverEid;

    addComponent(world, TransformRenderInterpolator, eid);

    return eid;
}
