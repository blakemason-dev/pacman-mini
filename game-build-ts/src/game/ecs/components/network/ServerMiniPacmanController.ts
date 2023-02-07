import {
    defineComponent,
    Types,
} from 'bitecs';

export const enum ServerMiniPacmanState {
    ServerControl,
    ClientControl,
}

export const ServerMiniPacmanController = defineComponent({
    state: Types.ui8,
    savedPosition: {
        x: Types.f32,
        y: Types.f32,
    }
});