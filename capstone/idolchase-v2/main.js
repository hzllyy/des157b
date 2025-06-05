import BootScene from './scenes/bootScene.js';
import DressUpScene from './scenes/dressup.js';
import ChaseScene from './scenes/chase.js';
import RoomScene from './scenes/room.js';
import ClosetScene from './scenes/closet.js';
import ClassroomScene from './scenes/classroom.js';
import HallwayScene from './scenes/hallway.js';
import LibraryScene from './scenes/library.js';
import MeetScene from './scenes/meet.js';
import CraftScene from './scenes/craft.js';
import ItemScene from './scenes/item.js';

const config = {
    type: Phaser.AUTO,
    width: 448,
    height: 256,
    parent: 'reference-2',
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
    scene: [BootScene, DressUpScene, ChaseScene, RoomScene, ClosetScene, ClassroomScene, HallwayScene, LibraryScene, MeetScene, CraftScene, ItemScene],
    dom: {
        createContainer: true
    }
};

const game = new Phaser.Game(config);