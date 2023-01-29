import {
    defineComponent,
    Types,
} from 'bitecs';

export const Image = defineComponent({
    textureIndex: Types.ui16,
    width: Types.f32,           // dimension should be in game space units (i.e. from server)
    height: Types.f32,          // ""
    origin: {
        x: Types.f32,
        y: Types.f32
    },
    depth: Types.ui16,
});