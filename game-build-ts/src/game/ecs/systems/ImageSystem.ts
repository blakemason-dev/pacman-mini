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
import { Image } from '../components/Image';
import { PacmanColor } from '../components/PacmanColor';
import { Transform } from '../components/Transform';
import { TransformRenderInterpolator } from '../components/TransformRenderInterpolator';

import * as AssetLibrary from '../libraries/AssetLibrary';

import * as ConvertServer from '../utilities/ConvertServer';

export const createImageSystem = (scene: Phaser.Scene, serverGameConfig: iServerGameConfig) => {
    const imagesById = new Map<number, Phaser.GameObjects.Image>();

    const imageQuery = defineQuery([Transform, Image]);
    const imageQueryEnter = enterQuery(imageQuery);
    const imageQueryExit = exitQuery(imageQuery);

    const pacmenQuery = defineQuery([PacmanColor])

    return defineSystem((world: IWorld) => {
        ///////////////////////////////////////////////
        // ENTER: Transform, Image, 
        const imagesEnter = imageQueryEnter(world);
        imagesEnter.map(eid => {
            // add to images by id
            imagesById.set(eid, scene.add.image(
                Transform.position.x[eid],
                Transform.position.y[eid],
                AssetLibrary.getKey(Image.textureIndex[eid])
            ));
            imagesById.get(eid)?.setDisplaySize(
                ConvertServer.dimToPhaser(Image.width[eid], serverGameConfig, scene.scale),
                ConvertServer.dimToPhaser(Image.height[eid], serverGameConfig, scene.scale)
            );
            imagesById.get(eid)?.setOrigin(
                Image.origin.x[eid],
                Image.origin.y[eid]
            )
            imagesById.get(eid)?.setDepth(Image.depth[eid]);
        });

        // UPDATE: Transform, Image, ServerCoordinateConverter
        const imagesUpdate = imageQuery(world);
        imagesUpdate.map(eid => {
            // update image sizes (if screen changes)
            imagesById.get(eid)?.setDisplaySize(
                ConvertServer.dimToPhaser(Image.width[eid], serverGameConfig, scene.scale),
                ConvertServer.dimToPhaser(Image.height[eid], serverGameConfig, scene.scale)
            );

            // check if has interpolator
            if (hasComponent(world, TransformRenderInterpolator, eid)) {
                // update image position
                imagesById.get(eid)?.setPosition(
                    ConvertServer.xToPhaser(TransformRenderInterpolator.interp.position.x[eid], serverGameConfig, scene.scale),
                    ConvertServer.yToPhaser(TransformRenderInterpolator.interp.position.y[eid], serverGameConfig, scene.scale)
                );
                // update image angle
                imagesById.get(eid)?.setAngle(ConvertServer.radToPhaserAngle(TransformRenderInterpolator.interp.rotation[eid]));
            }
            else {
                // update image position
                imagesById.get(eid)?.setPosition(
                    ConvertServer.xToPhaser(Transform.position.x[eid], serverGameConfig, scene.scale),
                    ConvertServer.yToPhaser(Transform.position.y[eid], serverGameConfig, scene.scale)
                );
                // update image angle
                imagesById.get(eid)?.setAngle(ConvertServer.radToPhaserAngle(Transform.rotation[eid]));
            }

            // ensure tint is up to date
            imagesById.get(eid)?.setTintFill(Image.tint[eid]);
            
        });

        // EXIT: Image, Transform
        const imagesExit = imageQueryExit(world);
        imagesExit.map(eid => {
            imagesById.get(eid)?.destroy();
            imagesById.delete(eid);
        });


        // update pacmen colours
        const pacmen = pacmenQuery(world);
        pacmen.map(eid => {
            // update texture based on current tint
            switch (Image.tint[eid]) {
                case 0xffcc00: {
                    Image.textureIndex[eid] = AssetLibrary.getIndex('yellow-pacman');
                    const str = AssetLibrary.getKey(Image.textureIndex[eid]);
                    imagesById.get(eid)?.setTexture(str);
                }
                case 0xff0000: {
                    Image.textureIndex[eid] = AssetLibrary.getIndex('red-pacman');
                    const str = AssetLibrary.getKey(Image.textureIndex[eid]);
                    imagesById.get(eid)?.setTexture(str);
                }
                case 0x0000ff: {
                    Image.textureIndex[eid] = AssetLibrary.getIndex('blue-pacman');
                    const str = AssetLibrary.getKey(Image.textureIndex[eid]);
                    imagesById.get(eid)?.setTexture(str);
                    console.log('check');
                }
                default: break;
            }
        });

        return world;
    })
}