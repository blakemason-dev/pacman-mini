import { MapSchema } from '@colyseus/schema';
import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { sBackground } from '../../types/sBackground';
import { sGameObject } from '../../types/sGameObject';

export const createPfBgCliffs = (world: IWorld, gos: MapSchema<sGameObject>) => {
    const eid = addEntity(world);

    gos.set(eid.toString(), new sBackground(30*16/9, 30));

    return eid;
}
