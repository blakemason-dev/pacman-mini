import {
    defineComponent,
    Types,
} from 'bitecs';

export const TransformRenderInterpolator = defineComponent({
    previous: {
        position: {
            x: Types.f32,
            y: Types.f32
        },
        rotation: Types.f32,
        scale: {
            x: Types.f32,
            y: Types.f32
        }
    },
    current: {
        position: {
            x: Types.f32,
            y: Types.f32
        },
        rotation: Types.f32,
        scale: {
            x: Types.f32,
            y: Types.f32
        }
    },
    interp: {
        position: {
            x: Types.f32,
            y: Types.f32
        },
        rotation: Types.f32,
        scale: {
            x: Types.f32,
            y: Types.f32
        }
    },
    // previous_ms: Types.f32,
    // current_ms: Types.f32,
    // delta_ms: Types.f32,
    // needsUpdate: Types.ui8,
    accum: Types.f32,
});