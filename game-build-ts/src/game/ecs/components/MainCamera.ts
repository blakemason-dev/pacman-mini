import {
    defineComponent,
    Types,
} from 'bitecs';

export const MainCamera = defineComponent({
    followEntity: Types.ui8,
    followLerp: Types.f32,  // between 0 and 1 => 0 tracks object slowly, 1 tracks object closely
});