import {
    defineComponent,
    Types,
} from 'bitecs';

export enum MiniPacmanState {
    Roaming,
    Following,
    Saved
}

export const MiniPacmanController = defineComponent({
    // events
    eventPacmanContact: Types.ui8,
    eventPortalContact: Types.ui8,

    // status
    state: Types.ui8,

    // roam variables
    roamTimer: Types.f32,
    roamTimeMin: Types.f32,
    roamTimeMax: Types.f32,
    roamVelocityMax: Types.f32,
    roamVelocityMin: Types.f32,
    roamVelocity: {
        x: Types.f32,
        y: Types.f32
    },

    // follow variables
    followingEid: Types.ui8,
});