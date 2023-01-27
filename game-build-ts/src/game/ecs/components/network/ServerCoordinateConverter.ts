import {
    defineComponent,
    Types,
} from 'bitecs';

// Component: ServerCoordinateConverter
// Usage: Attach to phaser components to automatically convert dimensions
//        received in server game coordinates into phaser screen coordinates
// Systems: ImageSystem

export const ServerCoordinateConverter = defineComponent({
    width: Types.f32,
    height: Types.f32,
    originX: Types.f32,
    originY: Types.f32
});