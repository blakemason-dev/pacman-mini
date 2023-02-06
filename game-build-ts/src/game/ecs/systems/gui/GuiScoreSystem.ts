import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
} from 'bitecs';
import GameServerHandler from '../../../services/GameServerHandler';
import { GuiScore } from '../../components/gui/GuiScore';

import { GuiText } from '../../components/gui/GuiText';
import { GuiTransform } from '../../components/gui/GuiTransform';

import * as TextLibrary from '../../libraries/TextLibrary';

export const createGuiScoreSystem = (scene: Phaser.Scene, world: IWorld, server: GameServerHandler) => {

    const guiScoresQuery = defineQuery([GuiScore]);

    server.events.on('updateRedScore', score => {
        const guiScores = guiScoresQuery(world);
        guiScores.map(eid => {
            if (GuiScore.color[eid] === 0xff0000) {
                GuiScore.score[eid] = score;
            }
        })
    });

    server.events.on('updateBlueScore', score => {
        const guiScores = guiScoresQuery(world);
        guiScores.map(eid => {
            if (GuiScore.color[eid] === 0x0000ff) {
                GuiScore.score[eid] = score;
            }
        })
    });

    return defineSystem((ecsWorld: IWorld) => {


        return world;
    });
}