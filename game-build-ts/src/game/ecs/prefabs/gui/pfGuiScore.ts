import {
    addEntity,
    addComponent,
    IWorld,
    removeComponent,
    removeEntity
} from 'bitecs';

import { GuiTransform } from '../../components/gui/GuiTransform';
import { GuiText } from '../../components/gui/GuiText';
import { GuiEvent } from '../../components/gui/GuiEvent';

import * as TextLibrary from '../../libraries/TextLibrary';
import { sGameObject } from '../../../../../../game-server/src/types/sGameObject';
import { GuiScore } from '../../components/gui/GuiScore';
import { GuiRectangle } from '../../components/gui/GuiRectangle';

export const createPfGuiScore = (world: IWorld, color: number, x: number, y: number) => {
    const eid = addEntity(world);

    addComponent(world, GuiTransform, eid);
    GuiTransform.position.x[eid] = x;
    GuiTransform.position.y[eid] = y;

    addComponent(world, GuiText, eid);
    const textColor = color === 0xff0000 ? 'red-score' : 'blue-score';
    GuiText.textIndex[eid] = TextLibrary.getIndex(textColor);
    GuiText.origin.x[eid] = 0.5;
    GuiText.origin.y[eid] = 0.5;
    GuiText.depth[eid] = 100;
    GuiText.sizePixels[eid] = 40;

    // addComponent(world, GuiRectangle, eid);
    // GuiRectangle.width[eid] = 60;
    // GuiRectangle.height[eid] = 60;
    // GuiRectangle.origin.x[eid] = 0.5;
    // GuiRectangle.origin.y[eid] = 0.5;
    // GuiRectangle.color[eid] = 0xcccccc;
    // GuiRectangle.alpha[eid] = 1;

    addComponent(world, GuiScore, eid);
    GuiScore.color[eid] = color;

    return eid; 
}

export const destroyPfGuiScore = (world: IWorld, eid: number) => {
    removeComponent(world, GuiTransform, eid);
    removeComponent(world, GuiText, eid);
    removeComponent(world, GuiScore, eid);
    removeEntity(world, eid);
}
