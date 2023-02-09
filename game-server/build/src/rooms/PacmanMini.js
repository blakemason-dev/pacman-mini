"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bitecs_1 = require("bitecs");
const colyseus_1 = require("colyseus");
const pfBgCliffs_1 = require("../ecs/prefabs/pfBgCliffs");
const pfClientPacman_1 = require("../ecs/prefabs/pfClientPacman");
const pfPortal_1 = require("../ecs/prefabs/pfPortal");
const pfWall_1 = require("../ecs/prefabs/pfWall");
const ClientPacmanControllerSystem_1 = require("../ecs/systems/ClientPacmanControllerSystem");
const GameObjectSyncSystem_1 = require("../ecs/systems/GameObjectSyncSystem");
const P2PhysicsSystem_1 = require("../ecs/systems/P2PhysicsSystem");
const ClientMessageHandler_1 = require("../services/ClientMessageHandler");
const sGameObject_1 = require("../types/sGameObject");
const PacmanMiniState_1 = __importDefault(require("./PacmanMiniState"));
const events_1 = require("events");
const GameEventHandler_1 = require("../services/GameEventHandler");
const pfMiniPacman_1 = require("../ecs/prefabs/pfMiniPacman");
const MiniPacmanControllerSystem_1 = require("../ecs/systems/MiniPacmanControllerSystem");
const ClientPacmanController_1 = require("../ecs/components/ClientPacmanController");
const UPDATE_FPS = 10;
const ARENA_WIDTH = 20;
const ARENA_HEIGHT = 20;
const PORTAL_RADIUS = 1.5;
class PacmanMiniRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.systems = [];
        this.events = new events_1.EventEmitter();
        // private clientPacmen: number[] = [];
        this.gameOver = false;
        this.accum = 1000 / UPDATE_FPS;
        this.prev_ms = Date.now();
    }
    onCreate() {
        console.log('PacmanMiniRoom: onCreate()');
        // limit number clients
        this.maxClients = 2;
        this.setState(new PacmanMiniState_1.default());
        // fire up the message handler
        this.clientMessageHandler = new ClientMessageHandler_1.ClientMessageHandler(this);
        // CREATE ECS WORLD
        this.world = (0, bitecs_1.createWorld)();
        // create game event handler
        this.gameEventHandler = new GameEventHandler_1.GameEventHandler(this.world, this.events);
        this.gameEventHandler.start();
    }
    onJoin(client) {
        console.log('PacmanMiniRoom: onJoin()' + ' => ' + client.sessionId);
        // create player pacman entity
        const eid = (0, pfClientPacman_1.createPfClientPacman)(this.world, this.state.gameObjects, client.sessionId, this.clients.length === 1 ? ARENA_WIDTH / 5 : -ARENA_WIDTH / 5, 0, this.clients.length === 1 ? 0x0000ff : 0xff0000);
        // this.clientPacmen.push(eid);
        // if we're at max clients start the match
        if (this.clients.length === this.maxClients) {
            this.startMatch();
        }
    }
    onLeave(client) {
        console.log('PacmanMiniRoom: onLeave()' + ' => ' + client.sessionId);
    }
    startMatch() {
        // Add game entities
        (0, pfBgCliffs_1.createPfBgCliffs)(this.world, this.state.gameObjects);
        // create walls
        this.createWalls();
        // create mini pacmen
        this.createMiniPacmen();
        // create portal to send mini pacmen home
        (0, pfPortal_1.createPfPortal)(this.world, this.state.gameObjects, 0, 0, PORTAL_RADIUS);
        // CREATE SYSTEMS
        this.systems.push((0, ClientPacmanControllerSystem_1.createClientPacmanControllerSystem)());
        this.systems.push((0, MiniPacmanControllerSystem_1.createMiniPacmanControllerSystem)(this.world, this.events, this.state.gameObjects));
        this.systems.push((0, P2PhysicsSystem_1.createP2PhysicsSystem)(this.events));
        this.systems.push((0, GameObjectSyncSystem_1.createGameObjectSyncSystem)(this.state.gameObjects));
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
        };
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
        const wallLeftEid = (0, pfWall_1.createPfWall)(this.world, this.state.gameObjects, -ARENA_WIDTH / 2, 0, 1, ARENA_HEIGHT + 1);
        const wallRightEid = (0, pfWall_1.createPfWall)(this.world, this.state.gameObjects, ARENA_WIDTH / 2, 0, 1, ARENA_HEIGHT + 1);
        const wallTopEid = (0, pfWall_1.createPfWall)(this.world, this.state.gameObjects, 0, ARENA_HEIGHT / 2, ARENA_WIDTH + 1, 1);
        const wallBottomEid = (0, pfWall_1.createPfWall)(this.world, this.state.gameObjects, 0, -ARENA_HEIGHT / 2, ARENA_WIDTH + 1, 1);
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
            };
            // find suitable postion between portal and walls
            box.x = Math.random() * ((ARENA_WIDTH / 2 - box.width / 2) - (PORTAL_RADIUS + box.width / 2)) + (PORTAL_RADIUS + box.width / 2);
            box.y = Math.random() * ((ARENA_HEIGHT / 2 - box.height / 2) - (PORTAL_RADIUS + box.height / 2)) + (PORTAL_RADIUS + box.height / 2);
            if (Math.random() >= 0.5)
                box.x = -box.x;
            if (Math.random() >= 0.5)
                box.y = -box.y;
            // create wall
            (0, pfWall_1.createPfWall)(this.world, this.state.gameObjects, box.x, box.y, box.width, box.height);
        }
    }
    createMiniPacmen() {
        const NUM_MINIS = 9;
        for (let i = 0; i < NUM_MINIS; i++) {
            const x = Math.random() * (ARENA_WIDTH * 0.9 / 2 - -ARENA_WIDTH * 0.9 / 2) + -ARENA_WIDTH * 0.9 / 2;
            const y = Math.random() * (ARENA_HEIGHT * 0.9 / 2 - -ARENA_HEIGHT * 0.9 / 2) + -ARENA_HEIGHT * 0.9 / 2;
            (0, pfMiniPacman_1.createPfMiniPacman)(this.world, this.state.gameObjects, x, y);
        }
    }
    update(dt) {
        if (!this.world)
            return;
        // run systems
        this.systems.map(system => {
            system(this.world);
        });
        this.state.serverTime += dt;
    }
    emitGameOver() {
        // get our pacmen and update their scores
        const pacmanGos = [];
        this.state.gameObjects.forEach((go, eid) => {
            if (go.type === sGameObject_1.GameObjectType.Pacman) {
                go.score = ClientPacmanController_1.ClientPacmanController.score[parseInt(eid)];
                pacmanGos.push(go);
            }
        });
        // determine winning pacman and send them out
        let winnerPacman;
        if (pacmanGos.length === 2) {
            if (pacmanGos[0].score > pacmanGos[1].score) {
                winnerPacman = pacmanGos[0];
            }
            else {
                winnerPacman = pacmanGos[1];
            }
            this.broadcast('all-mini-pacmen-saved', winnerPacman, { afterNextPatch: true });
        }
    }
}
exports.default = PacmanMiniRoom;
