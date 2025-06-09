import DialogueBox from "../ui/dialogueBox.js";
import Conversation from '../ui/conversation.js';

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
        this.locker.on('pointerdown', () => {
            this.scene.launch('LockerScene');
            this.scene.sleep();
        })
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

            if (!this.registry.get('friendTalk')) {
                this.conversation = new Conversation(this);
                this.conversation.setDialogueBox(this.dialogue);
                this.ella.sprite.removeInteractive();
                this.june.sprite.removeInteractive();

                this.time.delayedCall(100, () => {
                    this.conversation.addDialogue("Hi Lucy! Are you going to Jin's concert tonight?", 'ella-dialogue-happy');
                    this.conversation.addDialogue("Yes, I'm so excited! I even made him a gift!", 'lucy-talk-happy');
                    this.conversation.addDialogue("OMG, did you get the Meet and Greet tickets? I'm so jealous, they're so expensive!", 'ella-dialogue');
                    this.conversation.addDialogue("Well, he gave me a huge discount!", 'lucy-talk-happy');
                    this.conversation.addDialogue("What! Lucky!", 'ella-dialogue');
                    this.conversation.addDialogue("Me and Juni are going tonight too, but we're just going through boring GA.", 'ella-dialogue-happy');
                    this.conversation.addDialogue("Wait, I didn't agree to this.", 'june-dialogue');
                    this.conversation.addDialogue("Yes you did.", 'ella-dialogue-happy');
                    this.conversation.addDialogue("Since when--", 'june-dialogue');
                    this.conversation.addDialogue("Anyway, what did you make him?", 'ella-dialogue');
                    this.conversation.addDialogue("A cute little plushie! And it's super purple, since his favorite color is purple!", 'lucy-talk');
                    this.conversation.addDialogue("What? He told me his favorite color was green!", 'ella-dialogue-contempt');
                    this.conversation.addDialogue("No, he said it was purple!", 'lucy-talk');
                    this.conversation.addDialogue("You guys do know that stupid chatbot is not actually Jin right?", 'june-dialogue');
                    this.conversation.addDialogue("You don't have to ruin all the fun, Juni.", 'ella-dialogue-contempt');
                    this.conversation.addDialogue("Yeah, you don't know what you're talking about.", 'lucy-talk');

                    this.conversation.start();
                });

                this.registry.set('friendTalk', true);
                
                // Set up a listener for when the conversation ends
                this.conversation.dialogueBox.on('conversationComplete', () => {
                    this.ella.sprite.setInteractive({useHandCursor: true});
                    this.june.sprite.setInteractive({useHandCursor: true});
                });
                
            } else {
                this.dialogue.bg.setTexture('ella-dialogue-happy');
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Hi Lucy!", undefined, 'ella-dialogue-happy');
                });
            }
        })

        // read cursor input
        this.cursors = this.input.keyboard.createCursorKeys();

        this.inventory = this.add.image(380, 250, 'inventory').setInteractive({useHandCursor: true}).setOrigin(0.5, 1);

        const phone = this.add.image(420, 250, 'phone').setInteractive({useHandCursor: true}).setOrigin(0.5, 1);
        phone.on('pointerover', () => {
            phone.setTexture('phone-select');
        });
        phone.on('pointerout', () => {
            phone.setTexture('phone');
        });
        phone.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("I don't have any notifications right now.", undefined, 'lucy-talk');
            })
        });

        this.inventory.on('pointerover', () => {
            this.inventory.setTexture('inventory-select');
        })
        this.inventory.on('pointerout', () => {
            this.inventory.setTexture('inventory');
        })
        this.inventory.on('pointerdown', () => {
            this.scene.launch('ClassInventory');
        })
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