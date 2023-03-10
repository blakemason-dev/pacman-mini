
import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not,
    hasComponent
} from 'bitecs';

import p2, { Shape } from 'p2';
import { P2Body } from '../components/P2Body';
import { P2ShapeBox } from '../components/P2ShapeBox';
import { P2ShapeCircle } from '../components/P2ShapeCircle';
import { EventEmitter } from 'events';
import { ClientPacmanController, ClientPacmanState } from '../components/ClientPacmanController';
import { MiniPacmanController } from '../components/MiniPacmanController';

export const createP2PhysicsSystem = (events: EventEmitter) => {
    // create our physics world
    const p2World = new p2.World({
        gravity: [0, 0]
    });
    p2World.defaultContactMaterial.friction = 0.3;
    p2World.defaultContactMaterial.restitution = 0.3;
    p2World.defaultContactMaterial.stiffness = 1e7;

    // create a body map
    const p2BodiesById = new Map<number, p2.Body>();
    const p2ShapeCirclesById = new Map<number, p2.Circle>();
    const p2ShapeBoxesById = new Map<number, p2.Box>();

    // body only queries
    const p2BodyQuery = defineQuery([P2Body]);
    const p2BodyQueryEnter = enterQuery(p2BodyQuery);
    const p2BodyQueryExit = exitQuery(p2BodyQuery);

    // body and shape queries
    const p2ShapeCircleQuery = defineQuery([P2Body, P2ShapeCircle]);
    const p2ShapeCircleQueryEnter = enterQuery(p2ShapeCircleQuery);
    const p2ShapeCircleQueryExit = exitQuery(p2ShapeCircleQuery);

    const p2ShapeBoxQuery = defineQuery([P2Body, P2ShapeBox]);
    const p2ShapeBoxQueryEnter = enterQuery(p2ShapeBoxQuery);

    // handle contact events
    p2World.on('beginContact', (data: { shapeA: p2.Shape, shapeB: p2.Shape, bodyA: p2.Body, bodyB: p2.Body }) => {
        let eids: number[] = [];

        p2BodiesById.forEach((val, key, map) => {
            if (val.id === data.bodyA.id || val.id === data.bodyB.id) {
                eids.push(key);
            }
        });

        events.emit('beginEntityContact', eids);
    });

    p2World.on('endContact', (data: { shapeA: p2.Shape, shapeB: p2.Shape, bodyA: p2.Body, bodyB: p2.Body}) => {
        let eids: number[] = [];

        p2BodiesById.forEach((val, key, map) => {
            if (val.id === data.bodyA.id || val.id === data.bodyB.id) {
                eids.push(key);
            }
        });

        events.emit('endEntityContact', eids);
    });


    const FIXED_TIME_STEP = 1 / 20;
    let previous_ms = Date.now();

    return defineSystem((ecsWorld: IWorld) => {
        // find time deltas
        const current_ms = Date.now();
        const dt = Date.now() - previous_ms;
        previous_ms = current_ms;

        // ENTER
        // when bodies first run in system
        const enterP2Bodies = p2BodyQueryEnter(ecsWorld);
        enterP2Bodies.map(eid => {
            // create a p2 body
            const bod = new p2.Body({
                mass: P2Body.mass[eid],
                position: [P2Body.position.x[eid], P2Body.position.y[eid]],
                angle: P2Body.angle[eid]
            });

            // set body type
            switch (P2Body.type[eid]) {
                case 0: bod.type = p2.Body.STATIC; break;
                case 1: bod.type = p2.Body.DYNAMIC; break;
                case 2: bod.type = p2.Body.KINEMATIC; break;
                default: bod.type = 1; break;
            }

            // set collsion response
            bod.collisionResponse = P2Body.collisionResponse[eid] ? true : false;

            // add body to the world
            p2World.addBody(bod);

            // set body in our entity map
            p2BodiesById.set(eid, bod);
        });

        // when shapes first run in system
        const enterP2ShapeCircles = p2ShapeCircleQueryEnter(ecsWorld);
        enterP2ShapeCircles.map(eid => {
            // create a new shape
            const shape = new p2.Circle({
                radius: P2ShapeCircle.radius[eid],
            });

            // add shape to matching body
            if (shape) {
                p2BodiesById.get(eid)?.addShape(shape);
            }

            // set shape in entity map
            p2ShapeCirclesById.set(eid, shape);
        });

        const enterP2ShapeBoxes = p2ShapeBoxQueryEnter(ecsWorld);
        enterP2ShapeBoxes.map(eid => {
            // create a new shape
            const shape = new p2.Box({
                width: P2ShapeBox.width[eid],
                height: P2ShapeBox.height[eid]
            });

            // add shape to matching body
            if (shape) {
                p2BodiesById.get(eid)?.addShape(shape);
            }

            // set shape in entity map
            p2ShapeBoxesById.set(eid, shape);
        });

        // UPDATE
        // 1) move any bodies controlled by client movement
        const bodiesQuery = p2BodyQuery(ecsWorld);
        bodiesQuery.map(eid => {
            const bod = p2BodiesById.get(eid);
            if (bod) {
                // bod.applyForce([10000,10000], [P2Body.position.x[eid],P2Body.position.y[eid]]);

                if (hasComponent(ecsWorld, ClientPacmanController, eid)) {
                    if (ClientPacmanController.state[eid] !== ClientPacmanState.Knocked) {
                        // bod.position = [P2Body.position.x[eid], P2Body.position.y[eid]];
                        bod.velocity = [P2Body.velocity.x[eid], P2Body.velocity.y[eid]];
                        bod.angle = P2Body.angle[eid];
                    } else if (ClientPacmanController.state[eid] === ClientPacmanState.Knocked) {
                        // apply any forces (LINEAR FORCE ONLY APPLIED AT BODY CENTRE)
                        if (P2Body.applyForce.activate[eid]) {
                            bod.applyForce([P2Body.applyForce.x[eid], P2Body.applyForce.y[eid]], [P2Body.position.x[eid], P2Body.position.y[eid]]);
                            P2Body.applyForce.activate[eid] = 0;
                        }
                    }
                } else if (hasComponent(ecsWorld, MiniPacmanController, eid)) {
                    // bod.position = [P2Body.position.x[eid], P2Body.position.y[eid]];
                    bod.velocity = [P2Body.velocity.x[eid], P2Body.velocity.y[eid]];
                    bod.angle = P2Body.angle[eid];
                }
            }
        });

        // 2) step the physics world
        p2World.step(FIXED_TIME_STEP, dt/1000, 10);

        // 3) apply new physics states to P2Bodies
        const p2Bodies = p2BodyQuery(ecsWorld);
        p2Bodies.map(eid => {
            const bod = p2BodiesById.get(eid);
            if (bod) {
                P2Body.position.x[eid] = bod.interpolatedPosition[0];
                P2Body.position.y[eid] = bod.interpolatedPosition[1];
                P2Body.angle[eid] = bod.angle;
                bod.angularVelocity = 0;
            }
        });

        // EXIT
        const bodiesExit = p2BodyQueryExit(ecsWorld);
        bodiesExit.map(eid => {
            const bod = p2BodiesById.get(eid);
            if (bod) {
                bod.shapes.map(shp => {
                    bod.removeShape(shp);
                });
                p2World.removeBody(bod);
                p2BodiesById.delete(eid);
            }
        });

        const shapeCirclesExit = p2ShapeCircleQueryExit(ecsWorld);
        shapeCirclesExit.map(eid => {
            p2ShapeCirclesById.delete(eid);
        });

        return ecsWorld;
    })
}