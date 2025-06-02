import BootScene from './scenes/bootScene.js';
import DressUpScene from './scenes/dressup.js';
import ChaseScene from './scenes/chase.js';

const config = {
    type: Phaser.AUTO,
    width: 448,
    height: 256,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y : 500 },
            debug: true
        }
    },
    render: {
        antialias: false,
    },
    scene: [BootScene, DressUpScene, ChaseScene],
    dom: {
        createContainer: true
    }
};

const game = new Phaser.Game(config);