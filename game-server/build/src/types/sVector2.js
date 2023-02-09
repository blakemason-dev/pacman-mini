"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sVector2 = void 0;
const schema_1 = require("@colyseus/schema");
class sVector2 extends schema_1.Schema {
    constructor(x = 0, y = 0) {
        super();
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
}
__decorate([
    (0, schema_1.type)("number")
], sVector2.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)("number")
], sVector2.prototype, "y", void 0);
exports.sVector2 = sVector2;
