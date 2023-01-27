import {
    defineComponent,
    Types,
} from 'bitecs';

// export const TextLibrary = new Map<number, {text: string, style: {}}>();

export const GuiText = defineComponent({
    textIndex: Types.ui16,
    origin: {
        x: Types.f32,
        y: Types.f32
    }
});