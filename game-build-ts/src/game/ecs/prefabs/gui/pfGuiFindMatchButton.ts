import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { GuiEvent, GuiEventEnum } from '../../components/gui/GuiEvent';
import { GuiRectangle } from '../../components/gui/GuiRectangle';
import { GuiText } from '../../components/gui/GuiText';
import { GuiTransform } from '../../components/gui/GuiTransform';

import * as TextLibrary from '../../libraries/TextLibrary';

export const createPfGuiFindMatchButton = (world: IWorld) => {
    const eid = addEntity(world);

    addComponent(world, GuiRectangle, eid);
    GuiRectangle.width[eid] = 180;
    GuiRectangle.height[eid] = 60;
    GuiRectangle.origin.x[eid] = 0.5;
    GuiRectangle.origin.y[eid] = 0.5;
    GuiRectangle.color[eid] = 0xcccccc;
    GuiRectangle.alpha[eid] = 1;
    GuiRectangle.interactive[eid] = 1;

    addComponent(world, GuiTransform, eid);
    // set position in scene

    addComponent(world, GuiText, eid);
    GuiText.textIndex[eid] = TextLibrary.getIndex('find-match');
    GuiText.origin.x[eid] = 0.5;
    GuiText.origin.y[eid] = 0.5;

    return eid;
}