"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniPacmanController = exports.MiniPacmanState = void 0;
const bitecs_1 = require("bitecs");
var MiniPacmanState;
(function (MiniPacmanState) {
    MiniPacmanState[MiniPacmanState["Roaming"] = 0] = "Roaming";
    MiniPacmanState[MiniPacmanState["Following"] = 1] = "Following";
    MiniPacmanState[MiniPacmanState["Saved"] = 2] = "Saved";
})(MiniPacmanState = exports.MiniPacmanState || (exports.MiniPacmanState = {}));
exports.MiniPacmanController = (0, bitecs_1.defineComponent)({
    // events
    eventPacmanContact: bitecs_1.Types.ui8,
    eventPacmanContactEid: bitecs_1.Types.ui8,
    eventPortalContact: bitecs_1.Types.ui8,
    // status
    state: bitecs_1.Types.ui8,
    // contact states
    inPortal: bitecs_1.Types.ui8,
    // roam variables
    roamTimer: bitecs_1.Types.f32,
    roamTimeMin: bitecs_1.Types.f32,
    roamTimeMax: bitecs_1.Types.f32,
    roamVelocityMax: bitecs_1.Types.f32,
    roamVelocityMin: bitecs_1.Types.f32,
    roamVelocity: {
        x: bitecs_1.Types.f32,
        y: bitecs_1.Types.f32
    },
    // follow variables
    followingEid: bitecs_1.Types.ui8,
    color: bitecs_1.Types.ui16,
    // trigger functions
    triggerDestroy: bitecs_1.Types.ui8,
});
