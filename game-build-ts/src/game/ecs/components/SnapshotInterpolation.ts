import {
    defineComponent,
    Types,
} from 'bitecs';

export const SnapshotInterpolation = defineComponent({
    // final interpolated position that gets rendered
    render: {
        position: {
            x: Types.f32,
            y: Types.f32,
        },
        rotation: Types.f32,
    }
});