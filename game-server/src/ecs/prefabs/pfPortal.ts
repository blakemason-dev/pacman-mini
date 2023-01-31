import { MapSchema } from '@colyseus/schema';
import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { sGameObject } from '../../types/sGameObject';
import { sPortal } from '../../types/sPortal';
import { sWall } from '../../types/sWall';

import { ClientPacmanController } from '../components/ClientPacmanController';
import { GameObjectSync } from '../components/GameObjectSync';
import { MiniPacmanRescueZone } from '../components/MiniPacmanRescueZone';
import { P2Body } from '../components/P2Body';
import { P2ShapeBox } from '../components/P2ShapeBox';
import { P2ShapeCircle } from '../components/P2ShapeCircle';

export const createPfPortal = (
    world: IWorld,
    gos: MapSchema<sGameObject>,
    x: number,
    y: number,
    radius: number
    ) => {

    const eid = addEntity(world);

    gos.set(eid.toString(), new sPortal(x, y, radius));
    
    // Set ECS components
    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 0;
    P2Body.type[eid] = 0;
    P2Body.position.x[eid] = x;
    P2Body.position.y[eid] = y;
    P2Body.angle[eid] = 0;
    P2Body.collisionResponse[eid] = 0;

    addComponent(world, P2ShapeCircle, eid);
    P2ShapeCircle.radius[eid] = radius;

    addComponent(world, MiniPacmanRescueZone, eid);



    // don't need sync for static objects
    // addComponent(world, GameObjectSync, eid); 

    return eid;
}
