"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sBackground = void 0;
const schema_1 = require("@colyseus/schema");
const sGameObject_1 = require("./sGameObject");
const sVector2_1 = require("./sVector2");
class sBackground extends sGameObject_1.sGameObject {
    constructor(width = 10 * 1960 / 1080, height = 10) {
        super();
        this.position = new sVector2_1.sVector2();
        this.texture = "";
        this.width = 10 * 1960 / 1080;
        this.height = 10;
        this.type = sGameObject_1.GameObjectType.Background;
        this.width = width;
        this.height = height;
    }
}
__decorate([
    (0, schema_1.type)(sVector2_1.sVector2)
], sBackground.prototype, "position", void 0);
__decorate([
    (0, schema_1.type)('string')
], sBackground.prototype, "texture", void 0);
__decorate([
    (0, schema_1.type)('number')
], sBackground.prototype, "width", void 0);
__decorate([
    (0, schema_1.type)('number')
], sBackground.prototype, "height", void 0);
exports.sBackground = sBackground;
