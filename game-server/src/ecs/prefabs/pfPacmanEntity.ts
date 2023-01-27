import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { ClientMovement } from '../components/ClientMovement';
import { P2Body } from '../components/P2Body';
import { P2ShapeCircle } from '../components/P2ShapeCircle';


export const createPfPacmanEntity = (world: IWorld) => {
    const eid = addEntity(world);

    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 5;
    P2Body.type[eid] = 1;   // 0 = static, 1 = dynamic, 2 = kinematic

    addComponent(world, P2ShapeCircle, eid);
    P2ShapeCircle.radius[eid] = 0.5;
    // need to add offset code

    addComponent(world, ClientMovement, eid);

    return eid;
}
