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
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';
import { sGameObject } from '../../../../../../game-server/src/types/sGameObject';
import { sPacman } from '../../../../../../game-server/src/types/sPacman';
import { PacmanColor } from '../../components/PacmanColor';
import { SnapshotInterpolation } from '../../components/SnapshotInterpolation';

export const createPfServerPacman = (world: IWorld, serverEid: number, go: sGameObject) => {
    const eid = addEntity(world);

    addComponent(world, Image, eid);
    Image.textureIndex[eid] = AssetLibrary.getIndex('yellow-pacman');
    Image.width[eid] = 1;
    Image.height[eid] = 1;
    Image.origin.x[eid] = 0.5;
    Image.origin.y[eid] = 0.5;
    Image.depth[eid] = 1;
    Image.tint[eid] = (go as sPacman).color;
    Image.alpha[eid] = 1;

    addComponent(world, Transform, eid);
    Transform.position.x[eid] = (go as sPacman).position.x;
    Transform.position.y[eid] = (go as sPacman).position.y;

    addComponent(world, ServerGameObjectSync, eid);
    ServerGameObjectSync.serverEid[eid] = serverEid;

    addComponent(world, SnapshotInterpolation, eid);

    addComponent(world, PacmanColor, eid);

    return eid;
}

export const destroyPfServerPacman = (world: IWorld, eid: number) => {
    removeComponent(world, Image, eid);
    removeComponent(world, Transform, eid);
    removeComponent(world, ServerGameObjectSync, eid);
    removeComponent(world, SnapshotInterpolation, eid);
    removeComponent(world, PacmanColor, eid);
    removeEntity(world, eid);
}
