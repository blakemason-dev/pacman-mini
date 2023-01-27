import {
    defineComponent,
    Types,
} from 'bitecs';

export const GuiRectangle = defineComponent({
    width: Types.f32,
    height: Types.f32,
    color: Types.ui32,
    alpha: Types.f32,
    origin: {
        x: Types.f32,
        y: Types.f32
    },
    interactive: Types.ui8
});