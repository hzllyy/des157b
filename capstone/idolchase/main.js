import BootScene from './scenes/bootScene.js';
import DressUpScene from './scenes/dressup.js';

const config = {
    type: Phaser.AUTO,
    width: 448,
    height: 256,
    pixelArt: true,
    render: {
        antialias: false,
    },
    scene: [BootScene, DressUpScene],
};

const game = new Phaser.Game(config);