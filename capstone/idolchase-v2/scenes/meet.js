import DialogueBox from "../ui/dialogueBox.js";
import Conversation from '../ui/conversation.js';

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

        this.lucySat = false;
        this.conversationStarted = false;

        this.add.image(0, 0, 'bgmeet').setOrigin(0,0);
        this.lucy = this.add.sprite(-75, 194, 'wedding-lucy-1').play('wedding-walk').setOrigin(1, 1).setVisible(true);
        this.lucysit = this.add.image(312, 194, 'lucy-sit').setOrigin(1,1).setVisible(false);
        this.add.image(270, 180, 'stool');

        this.input.on('pointerdown', (pointer) => {
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });

        this.dialogue = new DialogueBox(this, 150, 256, 'idol-talk-happy');
        this.conversation = new Conversation(this);
        this.conversation.setDialogueBox(this.dialogue);

        // multiple choice ux
        this.multipleChoiceBg = this.add.image(250, 207, 'idol-talk-scared').setVisible(false);
        this.multipleChoiceContainer = document.createElement('div');
        this.multipleChoiceContainer.id = 'choice-container';
        this.multipleChoiceContainer.style.display = 'none'; 

        this.choiceOne = document.createElement('p');
        this.choiceOne.textContent = 'Purple is your favorite color!';
        this.multipleChoiceContainer.appendChild(this.choiceOne);

        this.choiceTwo = document.createElement('p');
        this.choiceTwo.textContent = 'Because lilacs are purple.';
        this.multipleChoiceContainer.appendChild(this.choiceTwo);

        this.choiceThree = document.createElement('p');
        this.choiceThree.textContent = "I don't like purple. I like blue.";
        this.multipleChoiceContainer.appendChild(this.choiceThree);

        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.multipleChoiceContainer);
        }

        // Listen for conversation completion
        this.conversation.dialogueBox.once('conversationComplete', () => {
            this.multipleChoiceBg.setVisible(true);
            this.multipleChoiceContainer.style.display = 'block';
        });

        this.choiceOne.addEventListener('click', () => {
            this.multipleChoiceBg.setVisible(false);
            this.multipleChoiceContainer.style.display = 'none';
            this.conversation.addDialogue('Purple is your favorite color!', 'idol-talk-happy');
            this.conversation.start();
            this.qAnswered = true;
        });
        this.choiceTwo.addEventListener('click', () => {
            this.multipleChoiceBg.setVisible(false);
            this.multipleChoiceContainer.style.display = 'none';
            this.conversation.addDialogue('Because lilacs are purple.', 'idol-talk-happy');
            this.conversation.start();
            this.qAnswered = true;
        });
        this.choiceThree.addEventListener('click', () => {
            this.multipleChoiceBg.setVisible(false);
            this.multipleChoiceContainer.style.display = 'none';
            this.conversation.addDialogue("I don't like purple. I like blue.", 'idol-talk');
            this.conversation.start();
            this.qAnswered = true;
        });
    }

    update() {
        if (this.lucy.x < 312) {
            this.lucy.x = this.lucy.x + 0.45;
        } else {
            this.lucy.setVisible(false);
            this.lucysit.setVisible(true);
            this.lucySat = true;
            
            // start conversation when Lucy sits down
            if (!this.conversationStarted) {
                this.conversationStarted = true;
                this.time.delayedCall(500, () => {
                    this.conversation.addDialogue("Hello! Thank you for coming to my concert!", 'idol-talk-happy');
                    this.conversation.addDialogue("Hi babe! I missed you so much!", 'wedding-talk-happy');
                    this.conversation.start();
                    this.conversation.addDialogue("...", 'idol-talk');
                    this.conversation.addDialogue("I missed you too! I like your outfit. You look very beautiful.", 'idol-talk-happy');
                    this.conversation.addDialogue("Thanks! When we get married, I'll get an even prettier dress.", 'wedding-talk-happy');
                    this.conversation.addDialogue("I'm looking forward to it.", 'idol-talk-happy');
                    this.conversation.addDialogue("I even got you a gift!", 'wedding-talk');
                    this.conversation.addDialogue("Oh wow! Thank you, you shouldn't have.", 'idol-talk-happy');
                    this.conversation.addDialogue("...", 'wedding-talk-neutral');
                    this.conversation.addDialogue("I told you I was going to bring you a gift, remember?", 'wedding-talk');
                    this.conversation.addDialogue("Of course I remember.", 'idol-talk-happy');
                    this.conversation.addDialogue("Yeah, I even made sure to make it in your favorite color.", 'wedding-talk');
                    this.conversation.addDialogue("Oh wow, in blue?", 'idol-talk-happy');
                    this.conversation.addDialogue("...", 'wedding-talk-neutral');
                    this.conversation.addDialogue("No, in purple.", 'wedding-talk-neutral');
                    this.conversation.addDialogue("Oh, right.", 'idol-talk-happy');
                    this.conversation.addDialogue("You said your favorite color was purple this morning.", 'wedding-talk-neutral');
                    this.conversation.addDialogue("Well, now that my hair is purple, I've been liking purple a lot more these days.", 'idol-talk-happy');
                    this.conversation.addDialogue("That's not why you like purple.", 'wedding-talk-neutral');
                    this.conversation.addDialogue("What?", 'idol-talk');
                    this.conversation.addDialogue("That's not why you like purple.", 'wedding-talk-angry');
                    this.conversation.addDialogue("Oh... you're right.", 'idol-talk');
                    this.conversation.addDialogue("Why do you like purple?", 'wedding-talk-angry');
                    this.conversation.addDialogue("Oh, well. You know...", 'idol-talk-scared');
                });
            }
        }

        if (this.qAnswered && !this.followUpStarted) {
            this.followUpStarted = true;
            this.conversation.dialogueBox.once('conversationComplete', () => {
                this.conversation.addDialogue("That's wrong.", 'lucy-talk-angry');
                this.conversation.addDialogue("Who are you?", 'lucy-talk-angry');
                this.conversation.addDialogue("...", 'idol-talk-scared');
                this.conversation.addDialogue("Anyways, thanks for the gift! Let me just open that right now...", 'idol-talk-happy');
                this.conversation.start();

                this.conversation.dialogueBox.once('conversationComplete', () => {
                    this.scene.start('GiftScene');
                });
            });
        }
    }
}
