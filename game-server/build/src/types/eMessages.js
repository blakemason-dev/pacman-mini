"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var Message;
(function (Message) {
    Message[Message["ClientMoveUpBegin"] = 0] = "ClientMoveUpBegin";
    Message[Message["ClientMoveUpEnd"] = 1] = "ClientMoveUpEnd";
    Message[Message["ClientMoveDownBegin"] = 2] = "ClientMoveDownBegin";
    Message[Message["ClientMoveDownEnd"] = 3] = "ClientMoveDownEnd";
    Message[Message["ClientMoveLeftBegin"] = 4] = "ClientMoveLeftBegin";
    Message[Message["ClientMoveLeftEnd"] = 5] = "ClientMoveLeftEnd";
    Message[Message["ClientMoveRightBegin"] = 6] = "ClientMoveRightBegin";
    Message[Message["ClientMoveRightEnd"] = 7] = "ClientMoveRightEnd";
    Message[Message["ClientDash"] = 8] = "ClientDash";
})(Message = exports.Message || (exports.Message = {}));
