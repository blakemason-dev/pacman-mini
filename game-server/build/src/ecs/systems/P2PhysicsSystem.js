"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createP2PhysicsSystem = void 0;
const bitecs_1 = require("bitecs");
const p2_1 = __importDefault(require("p2"));
const P2Body_1 = require("../components/P2Body");
const P2ShapeBox_1 = require("../components/P2ShapeBox");
const P2ShapeCircle_1 = require("../components/P2ShapeCircle");
const ClientPacmanController_1 = require("../components/ClientPacmanController");
const MiniPacmanController_1 = require("../components/MiniPacmanController");
const createP2PhysicsSystem = (events) => {
    // create our physics world
    const p2World = new p2_1.default.World({
        gravity: [0, 0]
    });
    p2World.defaultContactMaterial.friction = 0.3;
    p2World.defaultContactMaterial.restitution = 0.3;
    p2World.defaultContactMaterial.stiffness = 1e7;
    // create a body map
    const p2BodiesById = new Map();
    const p2ShapeCirclesById = new Map();
    const p2ShapeBoxesById = new Map();
    // body only queries
    const p2BodyQuery = (0, bitecs_1.defineQuery)([P2Body_1.P2Body]);
    const p2BodyQueryEnter = (0, bitecs_1.enterQuery)(p2BodyQuery);
    const p2BodyQueryExit = (0, bitecs_1.exitQuery)(p2BodyQuery);
    // body and shape queries
    const p2ShapeCircleQuery = (0, bitecs_1.defineQuery)([P2Body_1.P2Body, P2ShapeCircle_1.P2ShapeCircle]);
    const p2ShapeCircleQueryEnter = (0, bitecs_1.enterQuery)(p2ShapeCircleQuery);
    const p2ShapeCircleQueryExit = (0, bitecs_1.exitQuery)(p2ShapeCircleQuery);
    const p2ShapeBoxQuery = (0, bitecs_1.defineQuery)([P2Body_1.P2Body, P2ShapeBox_1.P2ShapeBox]);
    const p2ShapeBoxQueryEnter = (0, bitecs_1.enterQuery)(p2ShapeBoxQuery);
    // handle contact events
    p2World.on('beginContact', (data) => {
        let eids = [];
        p2BodiesById.forEach((val, key, map) => {
            if (val.id === data.bodyA.id || val.id === data.bodyB.id) {
                eids.push(key);
            }
        });
        events.emit('beginEntityContact', eids);
    });
    p2World.on('endContact', (data) => {
        let eids = [];
        p2BodiesById.forEach((val, key, map) => {
            if (val.id === data.bodyA.id || val.id === data.bodyB.id) {
                eids.push(key);
            }
        });
        events.emit('endEntityContact', eids);
    });
    const FIXED_TIME_STEP = 1 / 20;
    let previous_ms = Date.now();
    return (0, bitecs_1.defineSystem)((ecsWorld) => {
        // find time deltas
        const current_ms = Date.now();
        const dt = Date.now() - previous_ms;
        previous_ms = current_ms;
        // ENTER
        // when bodies first run in system
        const enterP2Bodies = p2BodyQueryEnter(ecsWorld);
        enterP2Bodies.map(eid => {
            // create a p2 body
            const bod = new p2_1.default.Body({
                mass: P2Body_1.P2Body.mass[eid],
                position: [P2Body_1.P2Body.position.x[eid], P2Body_1.P2Body.position.y[eid]],
                angle: P2Body_1.P2Body.angle[eid]
            });
            // set body type
            switch (P2Body_1.P2Body.type[eid]) {
                case 0:
                    bod.type = p2_1.default.Body.STATIC;
                    break;
                case 1:
                    bod.type = p2_1.default.Body.DYNAMIC;
                    break;
                case 2:
                    bod.type = p2_1.default.Body.KINEMATIC;
                    break;
                default:
                    bod.type = 1;
                    break;
            }
            // set collsion response
            bod.collisionResponse = P2Body_1.P2Body.collisionResponse[eid] ? true : false;
            // add body to the world
            p2World.addBody(bod);
            // set body in our entity map
            p2BodiesById.set(eid, bod);
        });
        // when shapes first run in system
        const enterP2ShapeCircles = p2ShapeCircleQueryEnter(ecsWorld);
        enterP2ShapeCircles.map(eid => {
            var _a;
            // create a new shape
            const shape = new p2_1.default.Circle({
                radius: P2ShapeCircle_1.P2ShapeCircle.radius[eid],
            });
            // add shape to matching body
            if (shape) {
                (_a = p2BodiesById.get(eid)) === null || _a === void 0 ? void 0 : _a.addShape(shape);
            }
            // set shape in entity map
            p2ShapeCirclesById.set(eid, shape);
        });
        const enterP2ShapeBoxes = p2ShapeBoxQueryEnter(ecsWorld);
        enterP2ShapeBoxes.map(eid => {
            var _a;
            // create a new shape
            const shape = new p2_1.default.Box({
                width: P2ShapeBox_1.P2ShapeBox.width[eid],
                height: P2ShapeBox_1.P2ShapeBox.height[eid]
            });
            // add shape to matching body
            if (shape) {
                (_a = p2BodiesById.get(eid)) === null || _a === void 0 ? void 0 : _a.addShape(shape);
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
                if ((0, bitecs_1.hasComponent)(ecsWorld, ClientPacmanController_1.ClientPacmanController, eid)) {
                    if (ClientPacmanController_1.ClientPacmanController.state[eid] !== ClientPacmanController_1.ClientPacmanState.Knocked) {
                        // bod.position = [P2Body.position.x[eid], P2Body.position.y[eid]];
                        bod.velocity = [P2Body_1.P2Body.velocity.x[eid], P2Body_1.P2Body.velocity.y[eid]];
                        bod.angle = P2Body_1.P2Body.angle[eid];
                    }
                    else if (ClientPacmanController_1.ClientPacmanController.state[eid] === ClientPacmanController_1.ClientPacmanState.Knocked) {
                        // apply any forces (LINEAR FORCE ONLY APPLIED AT BODY CENTRE)
                        if (P2Body_1.P2Body.applyForce.activate[eid]) {
                            bod.applyForce([P2Body_1.P2Body.applyForce.x[eid], P2Body_1.P2Body.applyForce.y[eid]], [P2Body_1.P2Body.position.x[eid], P2Body_1.P2Body.position.y[eid]]);
                            P2Body_1.P2Body.applyForce.activate[eid] = 0;
                        }
                    }
                }
                else if ((0, bitecs_1.hasComponent)(ecsWorld, MiniPacmanController_1.MiniPacmanController, eid)) {
                    // bod.position = [P2Body.position.x[eid], P2Body.position.y[eid]];
                    bod.velocity = [P2Body_1.P2Body.velocity.x[eid], P2Body_1.P2Body.velocity.y[eid]];
                    bod.angle = P2Body_1.P2Body.angle[eid];
                }
            }
        });
        // 2) step the physics world
        p2World.step(FIXED_TIME_STEP, dt / 1000, 10);
        // 3) apply new physics states to P2Bodies
        const p2Bodies = p2BodyQuery(ecsWorld);
        p2Bodies.map(eid => {
            const bod = p2BodiesById.get(eid);
            if (bod) {
                P2Body_1.P2Body.position.x[eid] = bod.interpolatedPosition[0];
                P2Body_1.P2Body.position.y[eid] = bod.interpolatedPosition[1];
                P2Body_1.P2Body.angle[eid] = bod.angle;
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
    });
};
exports.createP2PhysicsSystem = createP2PhysicsSystem;
