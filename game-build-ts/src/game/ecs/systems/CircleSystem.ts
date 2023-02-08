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
import { Circle } from '../components/Circle';
import { SnapshotInterpolation } from '../components/SnapshotInterpolation';
import { Transform } from '../components/Transform';

import * as AssetLibrary from '../libraries/AssetLibrary';

import * as ConvertServer from '../utilities/ConvertServer';

export const createCircleSystem = (scene: Phaser.Scene, serverGameConfig: iServerGameConfig) => {
    const circlesById = new Map<number, Phaser.GameObjects.Arc>();

    const circleQuery = defineQuery([Transform, Circle]);
    const circleQueryEnter = enterQuery(defineQuery([Changed(Transform), Circle]));
    const circleQueryExit = exitQuery(circleQuery);

    return defineSystem((world: IWorld) => {
        ///////////////////////////////////////////////
        // ENTER: Transform, Image, 
        const circlesEnter = circleQueryEnter(world);
        circlesEnter.map(eid => {
            // add to images by id
            circlesById.set(eid, scene.add.circle(
                Transform.position.x[eid],
                Transform.position.y[eid],
                Circle.radius[eid],
                Circle.fillColor[eid],
                Circle.fillAlpha[eid]
            ));
            circlesById.get(eid)?.setDisplaySize(
                ConvertServer.dimToPhaser(Circle.radius[eid]*2, serverGameConfig, scene.scale),
                ConvertServer.dimToPhaser(Circle.radius[eid]*2, serverGameConfig, scene.scale)
            );
            circlesById.get(eid)?.setOrigin(
                0.5,
                0.5
            )
            circlesById.get(eid)?.setDepth(Circle.depth[eid]);
        });

        // UPDATE: Transform, Image, ServerCoordinateConverter
        const circlesUpdate = circleQuery(world);
        circlesUpdate.map(eid => {
            // update image sizes (if screen changes)
            circlesById.get(eid)?.setDisplaySize(
                ConvertServer.dimToPhaser(Circle.radius[eid]*2, serverGameConfig, scene.scale),
                ConvertServer.dimToPhaser(Circle.radius[eid]*2, serverGameConfig, scene.scale)
            );

            // check if has interpolator
            if (hasComponent(world, SnapshotInterpolation, eid)) {
                // update image position
                circlesById.get(eid)?.setPosition(
                    ConvertServer.xToPhaser(SnapshotInterpolation.render.position.x[eid], serverGameConfig, scene.scale),
                    ConvertServer.yToPhaser(SnapshotInterpolation.render.position.y[eid], serverGameConfig, scene.scale)
                );
                // update image angle
                circlesById.get(eid)?.setAngle(ConvertServer.radToPhaserAngle(SnapshotInterpolation.render.rotation[eid]));
            }
            else {
                // update image position
                circlesById.get(eid)?.setPosition(
                    ConvertServer.xToPhaser(Transform.position.x[eid], serverGameConfig, scene.scale),
                    ConvertServer.yToPhaser(Transform.position.y[eid], serverGameConfig, scene.scale)
                );
                // update image angle
                circlesById.get(eid)?.setAngle(ConvertServer.radToPhaserAngle(Transform.rotation[eid]));
            }
            
        });

        // EXIT: Image, Transform
        const circlesExit = circleQueryExit(world);
        circlesExit.map(eid => {
            circlesById.get(eid)?.destroy();
            circlesById.delete(eid);
        });

        return world;
    })
}