import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../../libraries/AssetLibrary';

import { Image } from '../../components/Image';
import { Transform } from '../../components/Transform';
import { ServerGameObjectSync } from '../../components/network/ServerGameObjectSync';

export const createPfServerPacman = (world: IWorld, serverEid: number) => {
    const peid = addEntity(world);

    addComponent(world, Image, peid);
    Image.textureIndex[peid] = AssetLibrary.getIndex('yellow-pacman');
    Image.width[peid] = 32;
    Image.height[peid] = 32;
    Image.origin.x[peid] = 0.5;
    Image.origin.y[peid] = 0.5;

    addComponent(world, Transform, peid);
    Transform.position.x[peid] = 0;
    Transform.position.y[peid] = 0;

    addComponent(world, ServerGameObjectSync, peid);
    ServerGameObjectSync.serverEid[peid] = serverEid;

    return peid;
}
