import {
    defineComponent,
    Types,
} from 'bitecs';

export enum ClientPacmanState {
    Roaming,
    Dashing,
    Knocked
}

export const ClientPacmanController = defineComponent({
    // events
    eventUp: Types.ui8,
    eventDown: Types.ui8,
    eventLeft: Types.ui8,
    eventRight: Types.ui8,
    eventDash: Types.ui8,
    eventPortal: Types.ui8,

    eventPacmanContact: Types.ui8,
    eventPacmanContactEid: Types.ui8,

    // state
    state: Types.ui16,

    // dash variables
    dashTime: Types.f32,
    dashDirection: {
        x: Types.f32,
        y: Types.f32,
    },
    dashSpeed: Types.f32,

    // knocked vars
    knockedTIme: Types.f32,

    // score
    score: Types.ui8
});