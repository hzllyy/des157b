export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // load idle lucy
        this.load.image('lucy-idle-1', 'assets/shared/lucy-idle-1.PNG');
        this.load.image('lucy-idle-2', 'assets/shared/lucy-idle-2.PNG');

        // load default dialogues
        this.load.image('lucy-talk', 'assets/shared/default-lucy-dialogue.PNG');
        this.load.image('lucy-talk-happy', 'assets/shared/default-lucy-dialogue-happy.PNG');
        this.load.image('wedding-talk-happy', 'assets/shared/wedding-lucy-dialogue-happy.PNG')

        // load font
        this.load.bitmapFont('dogica', 'assets/shared/dogica2_0.png', 'assets/shared/dogica2.fnt');


    }

    create() {
        // create idle lucy animation
        this.anims.create({
            key: 'lucy-idle',
            frames: [
                {key: 'lucy-idle-1'},
                {key: 'lucy-idle-2'}
            ],
            frameRate: 2.5,
            repeat: -1
        })
        
        this.scene.start('DressUpScene');
    }
}