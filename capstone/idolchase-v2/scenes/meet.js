export default class MeetScene extends Phaser.Scene {
    constructor() {
        super('MeetScene');
    }

    preload() {
        //load bg
        this.load.image('bgmeet', 'assets/meet/bgmeet.PNG');

        // load lucy walk
        this.load.image('wedding-lucy-1', 'assets/meet/wedding-lucy-1.PNG');
        this.load.image('wedding-lucy-2', 'assets/meet/wedding-lucy-2.PNG');
        this.load.image('lucy-sit', 'assets/meet/lucy-sit.PNG');

        // load chair
        this.load.image('stool', 'assets/meet/stool.PNG');
    }

    create() {
        this.anims.create({
            key: 'wedding-walk',
            frames: [
                {key: 'wedding-lucy-1'},
                {key: 'wedding-lucy-2'}
            ],
            frameRate: 3,
            repeat: -1
        })

        this.add.image(0, 0, 'bgmeet').setOrigin(0,0);
        this.lucy = this.add.sprite(-75, 194, 'wedding-lucy-1').play('wedding-walk').setOrigin(1, 1).setVisible(true);
        this.lucysit = this.add.image(312, 194, 'lucy-sit').setOrigin(1,1).setVisible(false);
        this.add.image(270, 180, 'stool');
    }

    update() {
        if (this.lucy.x < 312) {
            this.lucy.x = this.lucy.x + 0.45;
        } else {
            this.lucy.setVisible(false);
            this.lucysit.setVisible(true);
        }
    }
}