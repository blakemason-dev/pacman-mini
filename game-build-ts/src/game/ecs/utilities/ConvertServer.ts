import Phaser from "phaser";
import { iServerGameConfig } from "../../../../../game-server/src/types/iServerGameConfig";

const xToPhaser = (serverX: number, iServerGameConfig: iServerGameConfig, phaserScale: Phaser.Scale.ScaleManager) => {
    const { width } = phaserScale;

    return serverX * width / iServerGameConfig.width + iServerGameConfig.originX * width;
}

const yToPhaser = (serverY: number, iServerGameConfig: iServerGameConfig, phaserScale: Phaser.Scale.ScaleManager) => {
    const { height } = phaserScale;

    return height - serverY * height / iServerGameConfig.height - iServerGameConfig.originY * height;
}

const dimToPhaser = (dimension: number, iServerGameConfig: iServerGameConfig, phaserScale: Phaser.Scale.ScaleManager) => {
    const { height } = phaserScale;

    return dimension * height / iServerGameConfig.height;
}

const radToPhaserAngle = (p2_rad: number) => {
    p2_rad = p2_rad % (2*Math.PI);
    if (p2_rad < 0) {
        p2_rad += (2*Math.PI);
    }
    return Phaser.Math.RadToDeg(-p2_rad);
}

export { xToPhaser, yToPhaser, dimToPhaser, radToPhaserAngle };