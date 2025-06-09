import DialogueBox from "../ui/dialogueBox.js";
import Conversation from '../ui/conversation.js';

export default class GiftScene extends Phaser.Scene {
    constructor() {
        super('GiftScene');
    
    }

    preload() {
        this.load.image('box-top', 'assets/gift/gift-top.PNG');
        this.load.image('note-hidden', 'assets/gift/note-hidden.PNG');
        this.load.image('note-hidden-select', 'assets/gift/note-hidden-select.PNG');
        this.load.image('note', 'assets/gift/note.PNG');
        this.load.image('note-select', 'assets/gift/note-select.PNG');
        this.load.image('box-top-select', 'assets/gift/top-select.PNG');
        this.load.image('voodoo', 'assets/gift/voodoo.PNG');
        this.load.image('openbg', 'assets/gift/openbg.PNG');
    }

    create() {
        this.add.image(0, 0, 'openbg').setOrigin(0, 0);
        this.voodoo = this.add.image(224, 126, 'voodoo').setVisible(false);
        this.top = this.add.image(224, 126, 'box-top').setInteractive({useHandCursor: true});
        this.note = this.add.image(224, 126, 'note-hidden').setInteractive({useHandCursor: true})
        this.ransom = this.add.image(224, 126, 'note').setVisible(false).setInteractive({useHandCursor: true});

        this.note.on('pointerover', () => {
            this.note.setTexture('note-hidden-select');
        });
        this.note.on('pointerout', () => {
            this.note.setTexture('note-hidden');
        });
        this.note.on('pointerdown', () => {
            this.note.setVisible(false);
            this.ransom.setVisible(true);
        })

        this.ransomClicked = false;
        this.voodooReveal = false;
        this.ransom.on('pointerover', () => {
            this.ransom.setTexture('note-select');
        });
        this.ransom.on('pointerout', () => {
            this.ransom.setTexture('note');
        });
        this.ransom.on('pointerdown', () => {
            this.ransom.x = 380;
            this.ransomClicked = true;
        })

        this.input.on('pointerdown', (pointer) => {
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });

        this.dialogue = new DialogueBox(this, 150, 256, 'idol-talk-happy');
        this.conversation = new Conversation(this);
        this.conversation.setDialogueBox(this.dialogue);

         // Listen for conversation completion
         this.conversation.dialogueBox.once('conversationComplete', () => {
            this.time.delayedCall(500, () => {
                this.scene.start('ChaseScene');
            }) 
        });
    }

    update() {
        if (this.ransomClicked) {
            this.top.on('pointerover', () => {
                this.top.setTexture('box-top-select')
            });
            this.top.on('pointerout', () => {
                this.top.setTexture('box-top')
            });
            this.top.on('pointerdown', () => {
                this.top.x = 410;
                this.voodoo.setVisible(true);
                this.voodooReveal = true;
            });
        }

        if (this.voodooReveal) {
            this.conversation.start();
            if (!this.conversationStarted) {
                this.conversationStarted = true;
                this.time.delayedCall(500, () => {
                    this.conversation.addDialogue("Oh wow. This is...", 'idol-talk-scared');
                    this.conversation.addDialogue("Um.", 'idol-talk-scared');
                    this.conversation.addDialogue("...", 'idol-talk-scared');
                    this.conversation.addDialogue("Hold on--how did you sneak that in here??", 'idol-talk-terrified');
                }
            )}
        }
    }
}