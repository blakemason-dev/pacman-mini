import { MapSchema } from '@colyseus/schema';
import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { sGameObject } from '../../types/sGameObject';
import { sPacman } from '../../types/sPacman';

import { ClientMovement } from '../components/ClientMovement';
import { GameObjectSync } from '../components/GameObjectSync';
import { P2Body } from '../components/P2Body';
import { P2ShapeCircle } from '../components/P2ShapeCircle';

export const createPfPacmanEntity = (world: IWorld, gos: MapSchema<sGameObject>, sessionId: string, x: number, y: number) => {
    const eid = addEntity(world);
    gos.set(eid.toString(), new sPacman(sessionId, x, y));

    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 5000;
    P2Body.type[eid] = 1;   // 0 = static, 1 = dynamic, 2 = kinematic
    P2Body.position.x[eid] = 0;
    P2Body.position.y[eid] = 7.5;
    P2Body.angle[eid] = 0;
    P2Body.collisionResponse[eid] = 1;

    addComponent(world, P2ShapeCircle, eid);
    P2ShapeCircle.radius[eid] = 0.5;
    // need to add offset code

    addComponent(world, ClientMovement, eid);

    addComponent(world, GameObjectSync, eid);

    return eid;
}
