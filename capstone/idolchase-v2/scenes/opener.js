export default class OpenerClass extends Phaser.Scene {
    constructor() {
        super('OpenerClass');
    }

    preload() {
        this.load.image('startingbg', 'assets/startend/startingbg.PNG');
        this.load.image('opener-bride1', 'assets/startend/opener-bride1.PNG');
        this.load.image('opener-bride2', 'assets/startend/opener-bride2.PNG');
        this.load.image('opener-bride3', 'assets/startend/opener-bride3.PNG');
        this.load.image('opener-lucy', 'assets/startend/opener-lucy.PNG');
        this.load.image('play-btn', 'assets/startend/play-btn.PNG');
        this.load.image('play-btn-select', 'assets/startend/play-btn-select.PNG');
    }

    create() {
        this.anims.create({
            key: 'lucy',
            frames: [
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-lucy'},
                {key: 'opener-bride1'},
                {key: 'opener-bride2'},
                {key: 'opener-bride3'},               
            ],
            frameRate: 8,
            repeat: -1
        })
        this.add.image(0, 0, 'startingbg').setOrigin(0,0);
        this.lucy = this.add.sprite(222, 115, 'opener-lucy').play('lucy');
        this.play = this.add.image(222, 193, 'play-btn').setInteractive({useHandCursor: true});
        this.play.on('pointerover', () => {
            this.play.setTexture('play-btn-select');
        });
        this.play.on('pointerout', () => {
            this.play.setTexture('play-btn');
        })
        this.play.on('pointerdown', () => {
            this.scene.start('StartScene');
        })
    }
}