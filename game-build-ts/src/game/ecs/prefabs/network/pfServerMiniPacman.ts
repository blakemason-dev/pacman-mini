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
import { sGameObject } from '../../../../../../game-server/src/types/sGameObject';
import { sMiniPacman } from '../../../../../../game-server/src/types/sMiniPacman';
import { PacmanColor } from '../../components/PacmanColor';

export const createPfServerMiniPacman = (world: IWorld, serverEid: number, go: sGameObject) => {
    const eid = addEntity(world);

    addComponent(world, Image, eid);
    Image.textureIndex[eid] = AssetLibrary.getIndex('yellow-pacman');
    Image.width[eid] = 0.5;
    Image.height[eid] = 0.5;
    Image.origin.x[eid] = 0.5;
    Image.origin.y[eid] = 0.5;
    Image.depth[eid] = 1;
    Image.tint[eid] = (go as sMiniPacman).color;

    addComponent(world, Transform, eid);
    Transform.position.x[eid] = (go as sMiniPacman).position.x;
    Transform.position.y[eid] = (go as sMiniPacman).position.y;

    addComponent(world, ServerGameObjectSync, eid);
    ServerGameObjectSync.serverEid[eid] = serverEid;

    addComponent(world, TransformRenderInterpolator, eid);

    addComponent(world, PacmanColor, eid);

    return eid;
}
