import {
    defineComponent,
    Types,
} from 'bitecs';

export const MiniPacmanController = defineComponent({
    eventPacmanContact: Types.ui8,
    eventPortalContact: Types.ui8
});