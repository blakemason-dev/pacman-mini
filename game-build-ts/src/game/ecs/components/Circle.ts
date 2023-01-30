import {
    defineComponent,
    Types,
} from 'bitecs';

export const Circle = defineComponent({
    // x: Types.f32,
    // y: Types.f32,
    radius: Types.f32,
    fillColor: Types.ui16,
    fillAlpha: Types.f32,
    depth: Types.ui16
});