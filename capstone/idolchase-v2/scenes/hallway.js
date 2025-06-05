import DialogueBox from "../ui/dialogueBox.js";

export default class HallwayScene extends Phaser.Scene {
    constructor() {
        super('HallwayScene');
    }

    preload() {
        //load bg
        this.load.image('bghall', 'assets/hallway/bghallway.PNG');

        // load interactables
        this.load.image('schooldoor', 'assets/hallway/classroomdoor.PNG');
        this.load.image('plaque', 'assets/hallway/plaque.PNG');
        this.load.image('locker', 'assets/hallway/locker.PNG');

        // load june
        this.load.image('june-1', 'assets/hallway/june-1.PNG');
        this.load.image('june-2', 'assets/hallway/june-2.PNG');
        this.load.image('june-dialogue', 'assets/hallway/june-dialogue.PNG');

        // load ella
        this.load.image('ella-1', 'assets/hallway/ella-1.PNG');
        this.load.image('ella-2', 'assets/hallway/ella-2.PNG');
        this.load.image('ella-dialogue', 'assets/hallway/ella-dialogue.PNG');
        this.load.image('ella-dialogue-happy', 'assets/hallway/ella-dialogue-happy.PNG');
        this.load.image('ella-dialogue-contempt', 'assets/hallway/ella-dialogue-contempt.PNG');

        this.load.image('classdoor', 'assets/shared/classroomdoor-select.PNG');
        this.load.image('lockerselect', 'assets/hallway/locker-select.PNG');
    }

    create() {
        // Set hallway check to true when entering the scene
        this.registry.set('hallwayCheck', true);

        // create anims
        if (!this.anims.exists('june')) {
            this.anims.create({
                key: 'june',
                frames: [
                    {key: 'june-1'},
                    {key: 'june-2'}
                ],
                frameRate: 2.5,
                repeat: -1
            });
        }

        if (!this.anims.exists('ella')) {
            this.anims.create({
                key: 'ella',
                frames: [
                    {key: 'ella-1'},
                    {key: 'ella-2'}
                ],
                frameRate: 2.5,
                repeat: -1
            });
        }

        // load bg
        this.bghall = this.add.image(0, 0, 'bghall').setOrigin(0, 0);
        this.bghallX = 0;  
        this.minX = -(this.bghall.width - this.sys.game.config.width);
        this.maxX = 0; 

        //items array
        this.itemshall = [];

        // add items to array
        this.schooldoor1 = this.add.image(120, 131, 'schooldoor').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.schooldoor1,
            x: 120
        });
        this.schooldoor1.on('pointerdown', () => {
            this.scene.wake('ClassroomScene');
            this.scene.sleep();
        });
        this.schooldoor1.on('pointerover', () => {
            this.schooldoor1.setTexture('classdoor');
        } );
        this.schooldoor1.on('pointerout', () => {
            this.schooldoor1.setTexture('schooldoor');
        } )
        this.itemshall.push({
            sprite: this.add.image(175, 131, 'plaque').setInteractive({useHandCursor: true}),
            x: 175
        });
        this.locker = this.add.image(287, 92, 'locker').setInteractive({useHandCursor: true})
        this.itemshall.push({
            sprite: this.locker,
            x: 287
        });
        this.locker.on('pointerover', () => {
            this.locker.setTexture('lockerselect');
        } );
        this.locker.on('pointerout', () => {
            this.locker.setTexture('locker');
        } )
        this.schooldoor2 = this.add.image(970, 131, 'schooldoor').setInteractive({useHandCursor: true})
        this.itemshall.push({
            sprite: this.schooldoor2,
            x: 970
        });
        this.schooldoor2.on('pointerover', () => {
            this.schooldoor2.setTexture('classdoor');
        } );
        this.schooldoor2.on('pointerout', () => {
            this.schooldoor2.setTexture('schooldoor');
        } )
        this.schooldoor2.on('pointerdown', () => {
            this.registry.set('libraryCheck', true);
            this.scene.launch('LibraryScene');
            this.scene.sleep();
        });
        this.itemshall.push({
            sprite: this.add.image(1020, 131, 'plaque').setInteractive({useHandCursor: true}),
            x: 1020
        });

        this.june = {
            sprite: this.add.sprite(580, 210, 'june-1')
                .setInteractive({useHandCursor: true})
                .setOrigin(0.5, 1)
                .play('june'),
            x: 580
        };
        this.itemshall.push(this.june);

        this.ella = {
            sprite: this.add.sprite(650, 210, 'ella-1')
                .setInteractive({useHandCursor: true})
                .setOrigin(0.5, 1)
                .play('ella'),
            x: 650
        };
        this.itemshall.push(this.ella);

        // load lucy
        this.lucy = this.add.sprite(224, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

        // talk to friends
        // dialogue run and skip
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (currentlyOver.length > 0 && currentlyOver.includes(this.june)) return;
        
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });

        var bgKey = '';
        this.dialogue = new DialogueBox(this, 150, 256, bgKey);

        this.june.sprite.on('pointerdown', () => {
            var bgKey = 'june-dialogue';
            this.dialogue.bg.setTexture(bgKey);

            this.time.delayedCall(100, () => {
                this.dialogue.show("Hey Lucy.", undefined, bgKey);
            });
        })

        this.ella.sprite.on('pointerdown', () => {
            var bgKey = 'ella-dialogue-happy';
            this.dialogue.bg.setTexture(bgKey);

            this.time.delayedCall(100, () => {
                this.dialogue.show("Hi Lucy!", undefined, bgKey);
            });
        })

        // read cursor input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    updateItemPosition(itemhall, offset) {
        itemhall.x += offset;
        itemhall.sprite.x = itemhall.x;
    }

    updateAllItems(direction) {
        for (const itemhall of this.itemshall) {
            this.updateItemPosition(itemhall, direction);
        }
    }
    
    update(time, delta) {
        // check if movement keys are pressed
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDown;

        const scrollSpeed = 0.175 * delta;

        if (this.cursors.left.isDown) {
            this.lucy.play('lucy-left', true);
            // Try to scroll bg
            const newBgHallX = Phaser.Math.Clamp(this.bghallX + scrollSpeed, this.minX, this.maxX);

            // move items if bg is scrolling
            if (newBgHallX !== this.bghallX) {
                this.bghallX = newBgHallX;
                this.bghall.x = this.bghallX;
                this.updateAllItems(scrollSpeed);
            }
        } else if (this.cursors.right.isDown) {
            this.lucy.play('lucy-right', true);
            const newBgHallX = Phaser.Math.Clamp(this.bghallX - scrollSpeed, this.minX, this.maxX);

            if (newBgHallX !== this.bghallX) {
                this.bghallX = newBgHallX;
                this.bghall.x = this.bghallX;
                this.updateAllItems(-scrollSpeed);
            }
        } else if (!isMoving) {
            this.lucy.play('lucy-idle', true);
        }

    }
}