"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const sGameObject_1 = require("../types/sGameObject");
class PacmanMiniState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.gameObjects = new schema_1.MapSchema();
        this.status = 0;
        this.serverTime = 0;
    }
}
__decorate([
    (0, schema_1.type)({ map: sGameObject_1.sGameObject })
], PacmanMiniState.prototype, "gameObjects", void 0);
__decorate([
    (0, schema_1.type)('number')
], PacmanMiniState.prototype, "status", void 0);
__decorate([
    (0, schema_1.type)('number')
], PacmanMiniState.prototype, "serverTime", void 0);
exports.default = PacmanMiniState;
