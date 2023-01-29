import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not,
    hasComponent
} from 'bitecs';
import { iServerGameConfig } from '../../../../../game-server/src/types/iServerGameConfig';
import { MainCamera } from '../components/MainCamera';
import { Transform } from '../components/Transform';
import { TransformRenderInterpolator } from '../components/TransformRenderInterpolator';
import * as ConvertServer from '../utilities/ConvertServer';

export const createMainCameraSystem = (scene: Phaser.Scene, serverGameConfig: iServerGameConfig) => {

    const camerasQuery = defineQuery([Transform, MainCamera]);

    return defineSystem((world: IWorld) => {
        ///////////////////////////////////////////////
        // ENTER: 


        ///////////////////////////////////////////////
        // UPDATE: 
        const cameras = camerasQuery(world);
        cameras.map(eid => {
            const followEid = MainCamera.followEntity[eid];
            let deltaX = 0;
            let deltaY = 0;

            if (hasComponent(world, TransformRenderInterpolator, followEid)) {
                deltaX = TransformRenderInterpolator.interp.position.x[followEid] - Transform.position.x[eid];
                deltaY = TransformRenderInterpolator.interp.position.y[followEid] - Transform.position.y[eid];
            } else {
                deltaX = Transform.position.x[MainCamera.followEntity[eid]] - Transform.position.x[eid];
                deltaY = Transform.position.y[MainCamera.followEntity[eid]] - Transform.position.y[eid];
            }

            Transform.position.x[eid] += deltaX * MainCamera.followLerp[eid];
            Transform.position.y[eid] += deltaY * MainCamera.followLerp[eid];

            scene.cameras.main.setScroll(
                ConvertServer.dimToPhaser(Transform.position.x[eid], serverGameConfig, scene.scale),
                ConvertServer.dimToPhaser(-Transform.position.y[eid], serverGameConfig, scene.scale)
            )
        });

        ///////////////////////////////////////////////
        // EXIT:


        return world;
    })
}