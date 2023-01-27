import {
    defineComponent,
    Types,
} from 'bitecs';

export enum GuiEventEnum {
    CREATE_PACMAN,
    CREATE_GHOST,
    UPDATE_COUNTER,
    CLICKED_FIND_MATCH,
}

export const GuiEvent = defineComponent({
    type: Types.ui16
});