import {
    defineComponent,
    Types,
} from 'bitecs';

export const P2Body = defineComponent({
    type: Types.ui8, // 0 = STATIC, 1 = DYNAMIC, 2 = KINEMATIC
    mass: Types.f32,
    position: {
        x: Types.f32,
        y: Types.f32
    },
    velocity: {
        x: Types.f32,
        y: Types.f32
    },
    angle: Types.f32,
    collisionResponse: Types.ui8,
});