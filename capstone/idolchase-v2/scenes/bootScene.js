export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // load idle lucy
        this.load.image('lucy-idle-1', 'assets/shared/lucy-idle-1.PNG');
        this.load.image('lucy-idle-2', 'assets/shared/lucy-idle-2.PNG');

        // load walk-right
        this.load.image('lucy-walk-1-right', 'assets/shared/lucy-walk-1-right.PNG');
        this.load.image('lucy-walk-2-right', 'assets/shared/lucy-walk-2-right.PNG');
        this.load.image('lucy-walk-3-right', 'assets/shared/lucy-walk-3-right.PNG');
        this.load.image('lucy-walk-4-right', 'assets/shared/lucy-walk-4-right.PNG');

        // walk left
        this.load.image('lucy-walk-1-left', 'assets/shared/lucy-walk-1-left.PNG');
        this.load.image('lucy-walk-2-left', 'assets/shared/lucy-walk-2-left.PNG');
        this.load.image('lucy-walk-3-left', 'assets/shared/lucy-walk-3-left.PNG');
        this.load.image('lucy-walk-4-left', 'assets/shared/lucy-walk-4-left.PNG');

        // load default dialogues
        this.load.image('lucy-talk', 'assets/shared/default-lucy-dialogue.PNG');
        this.load.image('lucy-talk-happy', 'assets/shared/default-lucy-dialogue-happy.PNG');
        this.load.image('wedding-talk-happy', 'assets/shared/wedding-lucy-dialogue-happy.PNG')

        this.load.image('classdoor', 'assets/shared/classroomdoor-select.PNG');
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

        // left-walk animatiopn
        this.anims.create({
            key: 'lucy-left',
            frames: [
                {key: 'lucy-walk-1-left'},
                {key: 'lucy-walk-2-left'},
                {key: 'lucy-walk-3-left'},
                {key: 'lucy-walk-4-left'},               
            ],
            frameRate: 3.25,
            repeat: -1
        })

        // right walk
        this.anims.create({
            key: 'lucy-right',
            frames: [
                {key: 'lucy-walk-1-right'},
                {key: 'lucy-walk-2-right'},
                {key: 'lucy-walk-3-right'},
                {key: 'lucy-walk-4-right'},               
            ],
            frameRate: 3.25,
            repeat: -1
        })

        // keep track of what scenes have been entered
        this.registry.set('hallwayCheck', false);
        this.registry.set('libraryCheck', false);

        // keep track of inventory items
        this.registry.set('catCheck', false);
        this.registry.set('clothCheck', false);
        this.registry.set('boxCheck', false);
        this.registry.set('buttonCheck', false);
        this.registry.set('allRoomItemsCollected', false);
        this.registry.set('giftCreated', false);
        
        this.scene.start('LibraryScene');
    }
}