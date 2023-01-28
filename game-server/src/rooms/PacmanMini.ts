import {
    createWorld,
    IWorld,
    System
} from "bitecs";
import { Client, Room } from "colyseus";
import { createPfPacmanEntity } from "../ecs/prefabs/pfPacmanEntity";
import { createClientMovementSystem } from "../ecs/systems/ClientMovementSystem";
import { createGameObjectSyncSystem } from "../ecs/systems/GameObjectSyncSystem";
import { createP2PhysicsSystem } from "../ecs/systems/P2PhysicsSystem";
import { ClientMessageHandler } from "../services/ClientMessageHandler";
import { sGameObject } from "../types/sGameObject";
import { sPacman } from "../types/sPacman";
import PacmanMiniState from "./PacmanMiniState";

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
        let eid = createPfPacmanEntity(this.world);
        this.state.gameObjects.set(eid.toString(), new sPacman(client.sessionId));

        this.startMatch();
    }

    onLeave(client: Client) {
        console.log('PacmanMiniRoom: onLeave()' + ' => ' + client.sessionId);
    }

    startMatch() {

        // CREATE SYSTEMS
        this.systems.push(createClientMovementSystem());
        this.systems.push(createP2PhysicsSystem());
        this.systems.push(createGameObjectSyncSystem(this.state.gameObjects));

        // set the update interval
        this.setSimulationInterval((dt) => this.update(dt));
        this.setPatchRate(100);

        // start listening for client messages
        this.clientMessageHandler.startListening();

        // create game config for clients
        const gameConfig = {
            width: 10 * 1920 / 1080,
            height: 10,
            originX: 0.5,
            originY: 0.5
        }

        // tell the clients match has been started
        this.broadcast('start-match', gameConfig);
    }

    stopMatch() {

    }

    update(dt: number) {
        if (!this.world) return;

        // run systems
        this.systems.map(system => {
            system(this.world);
        });
    }
}