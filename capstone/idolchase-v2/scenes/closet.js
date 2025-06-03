import RoomScene from './room.js';

export default class ClosetScene extends Phaser.Scene {
    constructor() {
        super('ClosetScene');
    }

    preload() {
        // load background
        this.load.image('closetbg', 'assets/closet/closet-bg.PNG');

        // load clothes
        this.load.image('clothes1', 'assets/closet/clothes-1.PNG');
        this.load.image('clothes2', 'assets/closet/clothes-2.PNG');
        this.load.image('clothes3', 'assets/closet/clothes-3.PNG');
        this.load.image('clothes4', 'assets/closet/clothes-4.PNG');
        this.load.image('clothes5', 'assets/closet/clothes-5.PNG');
        this.load.image('select', 'assets/closet/clothes-select.PNG');

        // load door
        this.load.image('doorblue', 'assets/closet/door-blue.PNG');

    }

    create() {
        // load bg
        this.closetbg = this.add.image(0, 0, 'closetbg').setOrigin(0, 0);

        // load door and lead back to room
        const doorblue = this.add.image(395, 121, 'doorblue').setInteractive({useHandCursor: true})
        doorblue.on('pointerdown', () => {
            this.scene.wake('RoomScene');
            this.scene.sleep();
        });

        this.add.image(288, 40, 'clothes1').setInteractive({useHandCursor: true})
        this.add.image(288, 100, 'clothes2').setInteractive({useHandCursor: true})
        this.add.image(174, 118, 'clothes3').setInteractive({useHandCursor: true})
        this.add.image(64, 63, 'clothes4').setInteractive({useHandCursor: true})
        this.add.image(64, 97, 'clothes5').setInteractive({useHandCursor: true})
        this.add.image(64, 37, 'select').setInteractive({useHandCursor: true})

        // add lucy
        this.lucy = this.add.sprite(347, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

    }

    update() {

    }
}