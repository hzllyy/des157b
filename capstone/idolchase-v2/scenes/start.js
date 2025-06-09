export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.image('bgstart', 'assets/room/room.PNG');
        this.load.image('boxstart', 'assets/room/box.PNG');
        this.load.image('dollstart', 'assets/room/plush.PNG');
        this.load.image('posterstart', 'assets/room/poster.PNG');
    }

    create() {
        this.anims.create({
            key: 'phone-flash',
            frames: [
                {key: 'phone'},
                {key: 'phone-select'}
            ],
            frameRate: 2,
            repeat: -1
        })

        this.add.image(0, 0, 'bgstart').setOrigin(0, 0);
        this.add.image(405, 129, 'dollstart');
        this.add.image(390, 70, 'posterstart');
        this.add.image(388, 181, 'boxstart')

        this.lucy = this.add.sprite(224, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

        const phone = this.add.sprite(420, 250, 'phone')
            .setInteractive({useHandCursor: true})
            .setOrigin(0.5, 1)
            .play('phone-flash');

        phone.on('pointerdown', () => {
            this.scene.start('PhoneScene');
        })
        
    }


}