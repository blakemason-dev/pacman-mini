"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sMiniPacman = void 0;
const schema_1 = require("@colyseus/schema");
const sGameObject_1 = require("./sGameObject");
const sVector2_1 = require("./sVector2");
class sMiniPacman extends sGameObject_1.sGameObject {
    constructor(serverEid, x = 0, y = 0) {
        super(sGameObject_1.GameObjectType.MiniPacman);
        this.position = new sVector2_1.sVector2();
        this.angle = 0;
        this.radius = 0.25;
        this.color = 0xffcc00;
        this.serverEid = -1;
        this.position.x = x;
        this.position.y = y;
        this.serverEid = serverEid;
    }
}
__decorate([
    (0, schema_1.type)(sVector2_1.sVector2)
], sMiniPacman.prototype, "position", void 0);
__decorate([
    (0, schema_1.type)('number')
], sMiniPacman.prototype, "angle", void 0);
__decorate([
    (0, schema_1.type)('number')
], sMiniPacman.prototype, "radius", void 0);
__decorate([
    (0, schema_1.type)('number')
], sMiniPacman.prototype, "color", void 0);
__decorate([
    (0, schema_1.type)('number')
], sMiniPacman.prototype, "serverEid", void 0);
exports.sMiniPacman = sMiniPacman;
