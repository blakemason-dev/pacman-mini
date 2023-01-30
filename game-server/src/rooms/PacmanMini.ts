import {
    createWorld,
    IWorld,
    System
} from "bitecs";
import { Client, Room } from "colyseus";
import { createPfBgCliffs } from "../ecs/prefabs/pfBgCliffs";
import { createPfPacmanEntity } from "../ecs/prefabs/pfPacmanEntity";
import { createPfPortal } from "../ecs/prefabs/pfPortal";
import { createPfWall } from "../ecs/prefabs/pfWall";
import { createClientMovementSystem } from "../ecs/systems/ClientMovementSystem";
import { createGameObjectSyncSystem } from "../ecs/systems/GameObjectSyncSystem";
import { createP2PhysicsSystem } from "../ecs/systems/P2PhysicsSystem";
import { ClientMessageHandler } from "../services/ClientMessageHandler";
import { sBackground } from "../types/sBackground";
import { sGameObject } from "../types/sGameObject";
import { sPacman } from "../types/sPacman";
import PacmanMiniState from "./PacmanMiniState";
import { EventEmitter } from 'events';
import { GameEventHandler } from "../services/GameEventHandler";

const UPDATE_FPS = 10;

export default class PacmanMiniRoom extends Room<PacmanMiniState> {
    private world!: IWorld;
    private systems: System[] = [];
    private events = new EventEmitter();
    private clientMessageHandler!: ClientMessageHandler;
    private gameEventHandler!: GameEventHandler;

    onCreate() {
        console.log('PacmanMiniRoom: onCreate()');

        // limit number clients
        this.maxClients = 1;

        this.setState(new PacmanMiniState());

        // fire up the message handler
        this.clientMessageHandler = new ClientMessageHandler(this);

        // CREATE ECS WORLD
        this.world = createWorld();

        // create game event handler
        this.gameEventHandler = new GameEventHandler(this.world, this.events);
        this.gameEventHandler.start();
    }

    onJoin(client: Client) {
        console.log('PacmanMiniRoom: onJoin()' + ' => ' + client.sessionId);

        // create player pacman entity
        createPfPacmanEntity(this.world, this.state.gameObjects, client.sessionId, 5, 0 );

        // if we're at max clients start the match
        if (this.clients.length === this.maxClients) {
            this.startMatch();
        }
    }

    onLeave(client: Client) {
        console.log('PacmanMiniRoom: onLeave()' + ' => ' + client.sessionId);
    }

    startMatch() {
        // Add game entities
        createPfBgCliffs(this.world, this.state.gameObjects);

        // create walls
        this.createWalls();

        // create portal to send mini pacmen home
        createPfPortal(this.world, this.state.gameObjects, 0, 0, 1.5, );

        // CREATE SYSTEMS
        this.systems.push(createClientMovementSystem());
        this.systems.push(createP2PhysicsSystem(this.events));
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

        const wallLeftEid = createPfWall(this.world, this.state.gameObjects, -WIDTH/2, 0, 1, HEIGHT);
        const wallRightEid = createPfWall(this.world, this.state.gameObjects, WIDTH/2, 0, 1, HEIGHT);
        const wallTopEid = createPfWall(this.world, this.state.gameObjects, 0, HEIGHT/2, WIDTH, 1);
        const wallBottomEid = createPfWall(this.world, this.state.gameObjects, 0, -HEIGHT/2, WIDTH, 1);

        // generate some random walls
        const numObstacles = 10;
        const BOX_DIM_MAX = 7.5;
        const BOX_DIM_MIN = 0.5;
        for (let i = 0; i < numObstacles; i++) {
            const x = Math.random() * (WIDTH/2 - -WIDTH/2) + -WIDTH/2;
            const y = Math.random() * (HEIGHT/2 - -HEIGHT/2) + -HEIGHT/2;
            const width = Math.random() * (BOX_DIM_MAX/2 - BOX_DIM_MIN/2) + BOX_DIM_MIN/2;
            const height = Math.random() * (BOX_DIM_MAX/2 - BOX_DIM_MIN/2) + BOX_DIM_MIN/2;
            createPfWall(this.world, this.state.gameObjects, x, y, width, height);
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