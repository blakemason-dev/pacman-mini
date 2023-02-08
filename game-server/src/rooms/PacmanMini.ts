import {
    createWorld,
    IWorld,
    System
} from "bitecs";
import { Client, Room } from "colyseus";
import { createPfBgCliffs } from "../ecs/prefabs/pfBgCliffs";
import { createPfClientPacman } from "../ecs/prefabs/pfClientPacman";
import { createPfPortal } from "../ecs/prefabs/pfPortal";
import { createPfWall } from "../ecs/prefabs/pfWall";
import { createClientPacmanControllerSystem } from "../ecs/systems/ClientPacmanControllerSystem";
import { createGameObjectSyncSystem } from "../ecs/systems/GameObjectSyncSystem";
import { createP2PhysicsSystem } from "../ecs/systems/P2PhysicsSystem";
import { ClientMessageHandler } from "../services/ClientMessageHandler";
import { sBackground } from "../types/sBackground";
import { GameObjectType, sGameObject } from "../types/sGameObject";
import { sPacman } from "../types/sPacman";
import PacmanMiniState from "./PacmanMiniState";
import { EventEmitter } from 'events';
import { GameEventHandler } from "../services/GameEventHandler";
import { createPfMiniPacman } from "../ecs/prefabs/pfMiniPacman";
import { createMiniPacmanControllerSystem } from "../ecs/systems/MiniPacmanControllerSystem";
import { ClientPacmanController } from "../ecs/components/ClientPacmanController";

const UPDATE_FPS = 10;
const ARENA_WIDTH = 12;
const ARENA_HEIGHT = 12;
const PORTAL_RADIUS = 1.5;

export default class PacmanMiniRoom extends Room<PacmanMiniState> {
    private world!: IWorld;
    private systems: System[] = [];
    private events = new EventEmitter();
    private clientMessageHandler!: ClientMessageHandler;
    private gameEventHandler!: GameEventHandler;
    // private clientPacmen: number[] = [];
    private gameOver = false;

    onCreate() {
        console.log('PacmanMiniRoom: onCreate()');

        // limit number clients
        this.maxClients = 2;

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
        const eid = createPfClientPacman(
            this.world,
            this.state.gameObjects,
            client.sessionId,
            this.clients.length === 1 ? ARENA_WIDTH / 5 : -ARENA_WIDTH / 5,
            0,
            this.clients.length === 1 ? 0x0000ff : 0xff0000);

        // this.clientPacmen.push(eid);

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

        // create mini pacmen
        this.createMiniPacmen();

        // create portal to send mini pacmen home
        createPfPortal(this.world, this.state.gameObjects, 0, 0, PORTAL_RADIUS,);

        // CREATE SYSTEMS
        this.systems.push(createClientPacmanControllerSystem());
        this.systems.push(createMiniPacmanControllerSystem(this.world, this.events, this.state.gameObjects));
        this.systems.push(createP2PhysicsSystem(this.events));
        this.systems.push(createGameObjectSyncSystem(this.state.gameObjects));

        // set the update interval
        this.setSimulationInterval((dt) => this.update(dt));
        this.setPatchRate(1000 / UPDATE_FPS);
        // this.setPatchRate(0);

        // start listening for client messages
        this.clientMessageHandler.startListening();

        // create game config for clients
        const gameConfig = {
            width: 10 * 1920 / 1080,
            height: 10,
            originX: 0.5,
            originY: 0.5,
            updateFps: UPDATE_FPS,
            timeStamp: this.state.serverTime
        }

        // tell the clients match has been started
        this.broadcast('start-match', gameConfig, { afterNextPatch: true });

        // listen for events
        this.events.on('all-mini-pacmen-saved', () => {
            this.emitGameOver();
        });
    }

    stopMatch() {

    }

    createWalls() {
        // create main boundary walls
        const wallLeftEid = createPfWall(this.world, this.state.gameObjects, -ARENA_WIDTH / 2, 0, 1, ARENA_HEIGHT + 1);
        const wallRightEid = createPfWall(this.world, this.state.gameObjects, ARENA_WIDTH / 2, 0, 1, ARENA_HEIGHT + 1);
        const wallTopEid = createPfWall(this.world, this.state.gameObjects, 0, ARENA_HEIGHT / 2, ARENA_WIDTH + 1, 1);
        const wallBottomEid = createPfWall(this.world, this.state.gameObjects, 0, -ARENA_HEIGHT / 2, ARENA_WIDTH + 1, 1);

        // generate some random obstacles
        const numObstacles = 10;
        const BOX_DIM_MAX = 5.0;
        const BOX_DIM_MIN = 0.5;

        for (let i = 0; i < numObstacles; i++) {
            // random box dimensions
            const box = {
                x: 0,
                y: 0,
                width: Math.random() * (BOX_DIM_MAX / 2 - BOX_DIM_MIN / 2) + BOX_DIM_MIN / 2,
                height: Math.random() * (BOX_DIM_MAX / 2 - BOX_DIM_MIN / 2) + BOX_DIM_MIN / 2,
            }

            // find suitable postion between portal and walls
            box.x = Math.random() * ((ARENA_WIDTH / 2 - box.width / 2) - (PORTAL_RADIUS + box.width / 2)) + (PORTAL_RADIUS + box.width / 2);
            box.y = Math.random() * ((ARENA_HEIGHT / 2 - box.height / 2) - (PORTAL_RADIUS + box.height / 2)) + (PORTAL_RADIUS + box.height / 2);
            if (Math.random() >= 0.5) box.x = -box.x;
            if (Math.random() >= 0.5) box.y = -box.y;

            // create wall
            createPfWall(this.world, this.state.gameObjects, box.x, box.y, box.width, box.height);
        }
    }

    createMiniPacmen() {
        const NUM_MINIS = 1;

        for (let i = 0; i < NUM_MINIS; i++) {
            const x = Math.random() * (ARENA_WIDTH * 0.9 / 2 - -ARENA_WIDTH * 0.9 / 2) + -ARENA_WIDTH * 0.9 / 2;
            const y = Math.random() * (ARENA_HEIGHT * 0.9 / 2 - -ARENA_HEIGHT * 0.9 / 2) + -ARENA_HEIGHT * 0.9 / 2;
            createPfMiniPacman(this.world, this.state.gameObjects, x, y);
        }
    }

    private accum = 1000 / UPDATE_FPS;
    private prev_ms = Date.now();

    update(dt: number) {
        if (!this.world) return;

        // run systems
        this.systems.map(system => {
            system(this.world);
        });

        this.state.serverTime += dt;
    }

    emitGameOver() {
        // get our pacmen and update their scores
        const pacmanGos: sPacman[] = [];
        this.state.gameObjects.forEach((go, eid) => {
            if (go.type === GameObjectType.Pacman) {
                (go as sPacman).score = ClientPacmanController.score[parseInt(eid)];
                pacmanGos.push(go as sPacman);
            }
        });

        // determine winning pacman and send them out
        let winnerPacman: sPacman;
        if (pacmanGos.length === 2) {
            if (pacmanGos[0].score > pacmanGos[1].score) {
                winnerPacman = pacmanGos[0];
            } else {
                winnerPacman = pacmanGos[1];
            }
            this.broadcast('all-mini-pacmen-saved', winnerPacman, { afterNextPatch: true });
        }
    }
}