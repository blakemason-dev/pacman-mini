import {
    defineComponent,
    Types,
} from 'bitecs';

export const P2ShapeCircle = defineComponent({
    radius: Types.f32,
    offset: {
        x: Types.f32,
        y: Types.f32,
    }
});