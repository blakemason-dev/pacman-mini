"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sGameObject = exports.GameObjectType = void 0;
const schema_1 = require("@colyseus/schema");
var GameObjectType;
(function (GameObjectType) {
    GameObjectType[GameObjectType["Pacman"] = 0] = "Pacman";
    GameObjectType[GameObjectType["MiniPacman"] = 1] = "MiniPacman";
    GameObjectType[GameObjectType["Rock"] = 2] = "Rock";
    GameObjectType[GameObjectType["Background"] = 3] = "Background";
    GameObjectType[GameObjectType["Wall"] = 4] = "Wall";
    GameObjectType[GameObjectType["Portal"] = 5] = "Portal";
})(GameObjectType = exports.GameObjectType || (exports.GameObjectType = {}));
class sGameObject extends schema_1.Schema {
    constructor(type = -1, sessionId = "") {
        super();
        this.type = type;
        this.sessionId = sessionId;
    }
}
__decorate([
    (0, schema_1.type)('number')
], sGameObject.prototype, "type", void 0);
__decorate([
    (0, schema_1.type)('string')
], sGameObject.prototype, "sessionId", void 0);
exports.sGameObject = sGameObject;
