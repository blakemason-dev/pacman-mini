"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPacmanController = exports.ClientPacmanState = void 0;
const bitecs_1 = require("bitecs");
var ClientPacmanState;
(function (ClientPacmanState) {
    ClientPacmanState[ClientPacmanState["Roaming"] = 0] = "Roaming";
    ClientPacmanState[ClientPacmanState["Dashing"] = 1] = "Dashing";
    ClientPacmanState[ClientPacmanState["Knocked"] = 2] = "Knocked";
})(ClientPacmanState = exports.ClientPacmanState || (exports.ClientPacmanState = {}));
exports.ClientPacmanController = (0, bitecs_1.defineComponent)({
    // events
    eventUp: bitecs_1.Types.ui8,
    eventDown: bitecs_1.Types.ui8,
    eventLeft: bitecs_1.Types.ui8,
    eventRight: bitecs_1.Types.ui8,
    eventDash: bitecs_1.Types.ui8,
    eventPortal: bitecs_1.Types.ui8,
    eventPacmanContact: bitecs_1.Types.ui8,
    eventPacmanContactEid: bitecs_1.Types.ui8,
    // state
    state: bitecs_1.Types.ui16,
    // dash variables
    dashTime: bitecs_1.Types.f32,
    dashDirection: {
        x: bitecs_1.Types.f32,
        y: bitecs_1.Types.f32,
    },
    dashSpeed: bitecs_1.Types.f32,
    dashCooldown: bitecs_1.Types.f32,
    // knocked vars
    knockedTIme: bitecs_1.Types.f32,
    // score
    score: bitecs_1.Types.ui8
});
