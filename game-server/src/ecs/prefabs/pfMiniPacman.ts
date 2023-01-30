import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import { ClientMovement } from '../components/ClientMovement';
import { GameObjectSync } from '../components/GameObjectSync';
import { P2Body } from '../components/P2Body';
import { P2ShapeCircle } from '../components/P2ShapeCircle';

export const createPfMiniPacman = (world: IWorld) => {
    const eid = addEntity(world);

    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 5;
    P2Body.type[eid] = 1;   // 0 = static, 1 = dynamic, 2 = kinematic
    P2Body.position.x[eid] = 0;
    P2Body.position.y[eid] = 0;
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