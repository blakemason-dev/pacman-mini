import {
    defineComponent,
    Types,
} from 'bitecs';

export const P2ShapeBox = defineComponent({
    width: Types.f32,
    height: Types.f32,
    offset: {
        x: Types.f32,
        y: Types.f32,
    }
});