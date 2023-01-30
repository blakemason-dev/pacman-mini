import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import { GameObjectSync } from '../components/GameObjectSync';
import { P2Body } from '../components/P2Body';
import { P2ShapeCircle } from '../components/P2ShapeCircle';
import { MapSchema } from '@colyseus/schema';
import { sGameObject } from '../../types/sGameObject';
import { sMiniPacman } from '../../types/sMiniPacman';

export const createPfMiniPacman = (world: IWorld, gos: MapSchema<sGameObject>, x: number, y: number) => {
    const eid = addEntity(world);
    gos.set(eid.toString(), new sMiniPacman(x,y));

    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 5;
    P2Body.type[eid] = 1;   // 0 = static, 1 = dynamic, 2 = kinematic
    P2Body.position.x[eid] = x;
    P2Body.position.y[eid] = y;
    P2Body.angle[eid] = 0;
    P2Body.collisionResponse[eid] = 1;

    addComponent(world, P2ShapeCircle, eid);
    P2ShapeCircle.radius[eid] = 0.25;
    // need to add offset code

    // add an NPC movement component here
    // addComponent(world, ClientMovement, eid);

    addComponent(world, GameObjectSync, eid);

    return eid;
}
