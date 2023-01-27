import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';
import { NameTag } from '../components/NameTag';
import { ServerCoordinateConverter } from '../components/network/ServerCoordinateConverter';
import { Transform } from '../components/Transform';
import * as ConvertServer from '../utilities/ConvertServer';

export const createNameTagSystem = (scene: Phaser.Scene) => {

    const nameTagsById = new Map<number, Phaser.GameObjects.Text>();

    const nameTagQuery = defineQuery([NameTag, Transform, ServerCoordinateConverter]);
    const nameTagQueryEnter = enterQuery(nameTagQuery);
    const nameTagQueryExit = exitQuery(nameTagQuery);

    const OFFSET = 1.0;

    return defineSystem((ecsWorld: IWorld) => {
        let q;

        // ENTERS
        q = nameTagQueryEnter(ecsWorld);
        q.map(eid => {
            // create a converter config
            const config = {
                width: ServerCoordinateConverter.width[eid],
                height: ServerCoordinateConverter.height[eid],
                originX: ServerCoordinateConverter.originX[eid],
                originY: ServerCoordinateConverter.originY[eid],
            }

            nameTagsById.set(eid, scene.add.text(
                ConvertServer.xToPhaser(Transform.position.x[eid], config, scene.scale),
                ConvertServer.yToPhaser(Transform.position.y[eid]+OFFSET, config, scene.scale),
                "You",
            ));

            const nameTag = nameTagsById.get(eid);
            nameTag?.setOrigin(0.5,0.5);
        });

        // UPDATES
        q = nameTagQuery(ecsWorld);
        q.map(eid => {
            // create a converter config
            const config = {
                width: ServerCoordinateConverter.width[eid],
                height: ServerCoordinateConverter.height[eid],
                originX: ServerCoordinateConverter.originX[eid],
                originY: ServerCoordinateConverter.originY[eid],
            }

            nameTagsById.get(eid)?.setPosition(
                ConvertServer.xToPhaser(Transform.position.x[eid], config, scene.scale),
                ConvertServer.yToPhaser(Transform.position.y[eid]+OFFSET, config, scene.scale)
            );
        });

        // EXITS
        q = nameTagQueryExit(ecsWorld);
        q.map(eid => {
            nameTagsById.get(eid)?.destroy();
            nameTagsById.delete(eid);
        });

        return ecsWorld;
    })
}