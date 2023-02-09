"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sRock = void 0;
const schema_1 = require("@colyseus/schema");
const sGameObject_1 = require("./sGameObject");
const sVector2_1 = require("./sVector2");
class sRock extends sGameObject_1.sGameObject {
    constructor() {
        super();
        this.position = new sVector2_1.sVector2();
        this.type = sGameObject_1.GameObjectType.Rock;
    }
}
__decorate([
    (0, schema_1.type)(sVector2_1.sVector2)
], sRock.prototype, "position", void 0);
exports.sRock = sRock;
