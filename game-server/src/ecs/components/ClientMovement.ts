import {
    defineComponent,
    Types,
} from 'bitecs';

export const ClientMovement = defineComponent({
    up: Types.ui8,
    down: Types.ui8,
    left: Types.ui8,
    right: Types.ui8,
    dash: Types.ui8
});