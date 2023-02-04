import {
    defineComponent,
    Types,
} from 'bitecs';

export const NUM_BUFFER = 5;

export const TRIv2 = defineComponent({
    positionX: [Types.f32, NUM_BUFFER],
    positionY: [Types.f32, NUM_BUFFER],
    rotation: [Types.f32, NUM_BUFFER],
    timeStamp: [Types.ui32, NUM_BUFFER],


    // dt_ms: [Types.f32, 5],
    // accum: Types.f32,
    // counter: Types.ui8,

    render: {
        position: {
            x: Types.f32,
            y: Types.f32,
        },
        rotation: Types.f32,
    }
});