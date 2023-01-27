import { Schema, type } from '@colyseus/schema';

export class sVector2 extends Schema {
    @type("number")
    x: number = 0;
    
    @type("number")
    y: number = 0;

    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
}