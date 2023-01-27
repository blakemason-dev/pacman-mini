import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';
import { iServerGameConfig } from '../../../../../game-server/src/types/iServerGameConfig';
import { Image } from '../components/Image';
import { ServerGameObjectSync } from '../components/network/ServerGameObjectSync';
import { Transform } from '../components/Transform';

import * as AssetLibrary from '../libraries/AssetLibrary';

import * as ConvertServer from '../utilities/ConvertServer';

export const createImageSystem = (scene: Phaser.Scene, serverGameConfig: iServerGameConfig) => {
    const imagesById = new Map<number, Phaser.GameObjects.Image>();
    
    const imageQuery = defineQuery([Transform, Image, Not(ServerGameObjectSync)]);
    const imageQueryEnter = enterQuery(imageQuery);
    const imageQueryExit = exitQuery(imageQuery);

    const serverImageQuery = defineQuery([Transform, Image, ServerGameObjectSync]);
    const serverImageQueryEnter = enterQuery(serverImageQuery);

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

        // UPDATE: Changed(Transform), Image, Not(ServerCoordinateConverter)
        const images = imageQuery(world);
        images.map(eid => {
            imagesById.get(eid)?.setPosition(
                Transform.position.x[eid],
                Transform.position.y[eid]
            );
            imagesById.get(eid)?.setRotation(Transform.rotation[eid]);
        });

        // EXIT: Image, Transform
        const exitImages = imageQueryExit(world);
        exitImages.map(eid => {
            imagesById.get(eid)?.destroy();
            imagesById.delete(eid);
        });


        // ENTER: Transform, Image, ServerCoordinateConverter
        const serverImagesEnter = serverImageQueryEnter(world);
        serverImagesEnter.map(eid => {
            // create a converter config
            const config = {
                width: serverGameConfig.width,
                height: serverGameConfig.height,
                originX: serverGameConfig.originX,
                originY: serverGameConfig.originY,
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
        const serverImagesUpdate = serverImageQuery(world);
        serverImagesUpdate.map(eid => {
            // create a converter config
            const config = {
                width: serverGameConfig.width,
                height: serverGameConfig.height,
                originX: serverGameConfig.originX,
                originY: serverGameConfig.originY,
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