import Phaser from 'phaser';
import { BootStrap } from './game/scenes/BootStrap';

// dimensions used for game config
let GAME_WIDTH = window.innerWidth;
let GAME_HEIGHT = window.innerHeight;

// create game config
const config = {
    type: Phaser.CANVAS,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: [BootStrap]
}

// create the phaser game
const game = new Phaser.Game(config);

// used whenever the game window changes size
const calcGameWindow = () => {
    GAME_WIDTH = window.innerWidth;
    GAME_HEIGHT = window.innerWidth * 1080 / 1960
    
    if (GAME_HEIGHT > window.innerHeight) {
        GAME_HEIGHT = window.innerHeight;
        GAME_WIDTH = window.innerHeight * 1960 / 1080;
    }
    console.log(GAME_WIDTH, GAME_HEIGHT);
    game.scale.resize(GAME_WIDTH, GAME_HEIGHT);
}

calcGameWindow();


window.addEventListener('resize', (e) => {
    calcGameWindow();
    game.scale.resize(GAME_WIDTH, GAME_HEIGHT);
});

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        toggleFullScreen();
    }
}, false);