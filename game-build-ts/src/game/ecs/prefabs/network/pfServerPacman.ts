import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../../libraries/AssetLibrary';

import { Image } from '../../components/Image';
import { Transform } from '../../components/Transform';
import { ServerPacmanController } from '../../components/network/ServerPacmanController';
import { ServerCoordinateConverter } from '../../components/network/ServerCoordinateConverter';
import { ServerGameConfig } from '../../../../../server/types/game-config';
import { NameTag } from '../../components/NameTag';

export const createPfServerPacman = (world: IWorld, serverIndex: number, serverGameConfig: ServerGameConfig) => {
    const peid = addEntity(world);

    addComponent(world, ServerPacmanController, peid);
    ServerPacmanController.serverIndex[peid] = serverIndex;

    addComponent(world, Image, peid);
    Image.textureIndex[peid] = AssetLibrary.getIndex(serverIndex === 0 ? 'yellow-pacman' : 'blue-pacman');
    Image.width[peid] = 32;
    Image.height[peid] = 32;
    Image.origin.x[peid] = 0.5;
    Image.origin.y[peid] = 0.5;

    addComponent(world, Transform, peid);
    Transform.position.x[peid] = 0;
    Transform.position.y[peid] = 0;

    addComponent(world, ServerCoordinateConverter, peid);
    ServerCoordinateConverter.width[peid] = serverGameConfig.width;
    ServerCoordinateConverter.height[peid] = serverGameConfig.height;
    ServerCoordinateConverter.originX[peid] = serverGameConfig.originX;
    ServerCoordinateConverter.originY[peid] = serverGameConfig.originY;

    return peid;
}
