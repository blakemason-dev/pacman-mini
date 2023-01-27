import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';

import { Image } from '../components/Image';
import { ServerCoordinateConverter } from '../components/network/ServerCoordinateConverter';
import { Transform } from '../components/Transform';

import * as AssetLibrary from '../libraries/AssetLibrary';

import * as ConvertServer from '../utilities/ConvertServer';

export const createImageSystem = (scene: Phaser.Scene) => {
    const imagesById = new Map<number, Phaser.GameObjects.Image>();
    
    const imageQuery = defineQuery([Transform, Image]);
    const imageQueryEnter = enterQuery(imageQuery);
    const imageQueryExit = exitQuery(imageQuery);

    const imageMovedQuery = defineQuery([Changed(Transform), Image, Not(ServerCoordinateConverter)]);

    const imageConversionQuery = defineQuery([Transform, Image, ServerCoordinateConverter]);
    const imageConversionQueryEnter = enterQuery(imageConversionQuery);

    return defineSystem((world: IWorld) => {
        // ENTER: Image, Transform
        const enterImages = imageQueryEnter(world);
        enterImages.map(eid => {
            imagesById.set(eid, scene.add.sprite(
                Transform.position.x[eid],
                Transform.position.y[eid],
                AssetLibrary.getKey(Image.textureIndex[eid])
            ));
            imagesById.get(eid)?.setDisplaySize(
                Image.width[eid],
                Image.height[eid]
            );
            imagesById.get(eid)?.setOrigin(
                Image.origin.x[eid],
                Image.origin.y[eid]
            )
        });

        // EXIT: Image, Transform
        const exitImages = imageQueryExit(world);
        exitImages.map(eid => {
            imagesById.get(eid)?.destroy();
            imagesById.delete(eid);
        });

        // UPDATE: Changed(Transform), Image, Not(ServerCoordinateConverter)
        const imagesMoved = imageMovedQuery(world);
        imagesMoved.map(eid => {
            imagesById.get(eid)?.setPosition(
                Transform.position.x[eid],
                Transform.position.y[eid]
            );
            imagesById.get(eid)?.setRotation(Transform.rotation[eid]);
        });

        // ENTER: Transform, Image, ServerCoordinateConverter
        const enterImageConversions = imageConversionQueryEnter(world);
        enterImageConversions.map(eid => {
            // create a converter config
            const config = {
                width: ServerCoordinateConverter.width[eid],
                height: ServerCoordinateConverter.height[eid],
                originX: ServerCoordinateConverter.originX[eid],
                originY: ServerCoordinateConverter.originY[eid],
            }

            // update image position
            imagesById.get(eid)?.setPosition(
                ConvertServer.xToPhaser(Transform.position.x[eid], config, scene.scale),
                ConvertServer.yToPhaser(Transform.position.y[eid], config, scene.scale)
            );

            // update image angle
            imagesById.get(eid)?.setAngle(ConvertServer.radToPhaserAngle(Transform.rotation[eid]));
        });

        // UPDATE: Transform, Image, ServerCoordinateConverter
        const imageConversions = imageConversionQuery(world);
        imageConversions.map(eid => {
            // create a converter config
            const config = {
                width: ServerCoordinateConverter.width[eid],
                height: ServerCoordinateConverter.height[eid],
                originX: ServerCoordinateConverter.originX[eid],
                originY: ServerCoordinateConverter.originY[eid],
            }

            // update image position
            imagesById.get(eid)?.setPosition(
                ConvertServer.xToPhaser(Transform.position.x[eid], config, scene.scale),
                ConvertServer.yToPhaser(Transform.position.y[eid], config, scene.scale)
            );

            // update image angle
            imagesById.get(eid)?.setAngle(ConvertServer.radToPhaserAngle(Transform.rotation[eid]));
        });

        return world;
    })
}