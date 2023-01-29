import {
    createWorld,
    IWorld,
    System
} from "bitecs";
import { Client, Room } from "colyseus";
import { createPfBgCliffs } from "../ecs/prefabs/pfBgCliffs";
import { createPfPacmanEntity } from "../ecs/prefabs/pfPacmanEntity";
import { createPfWall } from "../ecs/prefabs/pfWall";
import { createClientMovementSystem } from "../ecs/systems/ClientMovementSystem";
import { createGameObjectSyncSystem } from "../ecs/systems/GameObjectSyncSystem";
import { createP2PhysicsSystem } from "../ecs/systems/P2PhysicsSystem";
import { ClientMessageHandler } from "../services/ClientMessageHandler";
import { sBackground } from "../types/sBackground";
import { sGameObject } from "../types/sGameObject";
import { sPacman } from "../types/sPacman";
import PacmanMiniState from "./PacmanMiniState";

const UPDATE_FPS = 10;

export default class PacmanMiniRoom extends Room<PacmanMiniState> {
    private world!: IWorld;
    private systems: System[] = [];
    private clientMessageHandler!: ClientMessageHandler;

    onCreate() {
        console.log('PacmanMiniRoom: onCreate()');

        // limit number clients
        this.maxClients = 1;

        this.setState(new PacmanMiniState());

        // fire up the message handler
        this.clientMessageHandler = new ClientMessageHandler(this);

        // CREATE ECS WORLD
        this.world = createWorld();
    }

    onJoin(client: Client) {
        console.log('PacmanMiniRoom: onJoin()' + ' => ' + client.sessionId);

        // CREATE ENTITIES
        const eid = createPfPacmanEntity(this.world);
        this.state.gameObjects.set(eid.toString(), new sPacman(client.sessionId));

        this.startMatch();
    }

    onLeave(client: Client) {
        console.log('PacmanMiniRoom: onLeave()' + ' => ' + client.sessionId);
    }

    startMatch() {
        // Add game entities
        const bgEid = createPfBgCliffs(this.world, this.state.gameObjects);

        // create walls
        this.createWalls();

        // CREATE SYSTEMS
        this.systems.push(createClientMovementSystem());
        this.systems.push(createP2PhysicsSystem());
        this.systems.push(createGameObjectSyncSystem(this.state.gameObjects));

        // set the update interval
        this.setSimulationInterval((dt) => this.update(dt));
        this.setPatchRate(1000 / UPDATE_FPS);

        // start listening for client messages
        this.clientMessageHandler.startListening();

        // create game config for clients
        const gameConfig = {
            width: 10 * 1920 / 1080,
            height: 10,
            originX: 0.5,
            originY: 0.5,
            updateFps: UPDATE_FPS,
        }

        // tell the clients match has been started
        this.broadcast('start-match', gameConfig);
    }

    stopMatch() {

    }

    createWalls() {
        const WIDTH = 20;
        const HEIGHT = 20;

        const wallLeftEid = createPfWall(this.world, -WIDTH/2, 0, 1, HEIGHT, this.state.gameObjects);
        const wallRightEid = createPfWall(this.world, WIDTH/2, 0, 1, HEIGHT, this.state.gameObjects);
        const wallTopEid = createPfWall(this.world, 0, HEIGHT/2, WIDTH, 1, this.state.gameObjects);
        const wallBottomEid = createPfWall(this.world, 0, -HEIGHT/2, WIDTH, 1, this.state.gameObjects);

        // generate some random walls
        const numObstacles = 10;
        const BOX_DIM_MAX = 7.5;
        const BOX_DIM_MIN = 0.5;
        for (let i = 0; i < numObstacles; i++) {
            const x = Math.random() * (WIDTH/2 - -WIDTH/2) + -WIDTH/2;
            const y = Math.random() * (HEIGHT/2 - -HEIGHT/2) + -HEIGHT/2;
            const width = Math.random() * (BOX_DIM_MAX/2 - BOX_DIM_MIN/2) + BOX_DIM_MIN/2;
            const height = Math.random() * (BOX_DIM_MAX/2 - BOX_DIM_MIN/2) + BOX_DIM_MIN/2;
            createPfWall(this.world, x, y, width, height, this.state.gameObjects);
        }
    }

    update(dt: number) {
        if (!this.world) return;

        // run systems
        this.systems.map(system => {
            system(this.world);
        });
    }
}