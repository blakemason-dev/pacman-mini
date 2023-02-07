import {
    addEntity,
    addComponent,
    IWorld,
    removeComponent
} from 'bitecs';

import * as AssetLibrary from '../../libraries/AssetLibrary';
import { Image } from '../../components/Image';
import { Transform } from '../../components/Transform';
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { sGameObject } from '../../../../../../game-server/src/types/sGameObject';
import { sMiniPacman } from '../../../../../../game-server/src/types/sMiniPacman';
import { PacmanColor } from '../../components/PacmanColor';
import { SnapshotInterpolation } from '../../components/SnapshotInterpolation';
import { ServerMiniPacmanController } from '../../components/network/ServerMiniPacmanController';

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
    Image.alpha[eid] = 1;

    addComponent(world, Transform, eid);
    Transform.position.x[eid] = (go as sMiniPacman).position.x;
    Transform.position.y[eid] = (go as sMiniPacman).position.y;

    addComponent(world, ServerGameObjectSync, eid);
    ServerGameObjectSync.serverEid[eid] = serverEid;

    addComponent(world, SnapshotInterpolation, eid);

    addComponent(world, PacmanColor, eid);

    addComponent(world, ServerMiniPacmanController, eid);

    return eid;
}

export const destroyPfServerMiniPacman = (world: IWorld, eid: number) => {
    removeComponent(world, Image, eid);
    removeComponent(world, Transform, eid);
    removeComponent(world, ServerGameObjectSync, eid);
    removeComponent(world, SnapshotInterpolation, eid);
    removeComponent(world, PacmanColor, eid);
}
