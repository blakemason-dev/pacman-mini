import { MapSchema } from '@colyseus/schema';
import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { sGameObject } from '../../types/sGameObject';
import { sWall } from '../../types/sWall';

import { ClientMovement } from '../components/ClientMovement';
import { GameObjectSync } from '../components/GameObjectSync';
import { P2Body } from '../components/P2Body';
import { P2ShapeBox } from '../components/P2ShapeBox';
import { P2ShapeCircle } from '../components/P2ShapeCircle';

export const createPfWall = (
    world: IWorld,
    x: number,
    y: number,
    width: number,
    height: number,
    gos: MapSchema<sGameObject>
    ) => {

    const eid = addEntity(world);
    
    // Set ECS components
    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 0;
    P2Body.type[eid] = 0;
    P2Body.position.x[eid] = x;
    P2Body.position.y[eid] = y;
    P2Body.angle[eid] = 0;
    P2Body.collisionResponse[eid] = 1;

    addComponent(world, P2ShapeBox, eid);
    P2ShapeBox.width[eid] = width;
    P2ShapeBox.height[eid] = height;

    // Set room gameobject
    gos.set(eid.toString(), new sWall(x, y, width, height));

    // don't need sync for static objects
    // addComponent(world, GameObjectSync, eid);

    return eid;
}
