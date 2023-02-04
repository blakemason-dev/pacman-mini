import { iPacmanMiniState } from "./iPacmanMiniState";

export interface iServerGameConfig {
    width: number,
    height: number,
    originX: number,
    originY: number,
    updateFps: number,
    timeStamp: number,
}