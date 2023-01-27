import {
    defineComponent,
    Types,
} from 'bitecs';

export const ClientInput = defineComponent({
    w_key_down: Types.ui8,
    a_key_down: Types.ui8,
    s_key_down: Types.ui8,
    d_key_down: Types.ui8,
});