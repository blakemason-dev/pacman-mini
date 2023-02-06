import {
    defineComponent,
    Types,
} from 'bitecs';

export const GuiScore = defineComponent({
    trackEid: Types.ui16,
    color: Types.ui32,
    score: Types.ui16
});