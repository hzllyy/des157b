import DialogueBox from "../ui/dialogueBox.js";

export default class TicketScene extends Phaser.Scene {
    constructor() {
        super('TicketScene');
    }

    preload() {
        this.load.image('tixbg', 'assets/tickets/tixbg.PNG');
        this.load.image('vip', 'assets/tickets/vip.PNG');
        this.load.image('vip-select', 'assets/tickets/vip-select.PNG');
        this.load.image('ga', 'assets/tickets/ga.PNG');
        this.load.image('ga-select', 'assets/tickets/ga-select.PNG');
    }

    create() {
        this.add.image(0, 0, 'tixbg').setOrigin(0, 0);

        this.vip = this.add.image(220, 130, 'vip').setInteractive({useHandCursor: true});
        this.ga = this.add.image(220, 180, 'ga').setInteractive({useHandCursor: true});

        this.vip.on('pointerover', () => {
            this.vip.setTexture('vip-select');
        });
        this.vip.on('pointerout', () => {
            this.vip.setTexture('vip');
        });
        this.vip.on('pointerdown', () => {
            this.scene.start('PhoneSecondScene');
        })

        this.ga.on('pointerover', () => {
            this.ga.setTexture('ga-select');
        });
        this.ga.on('pointerout', () => {
            this.ga.setTexture('ga');
        });
        this.dialogue = new DialogueBox(this, 100, 256, 'lucy-talk');

        this.input.on('pointerdown', (pointer) => {
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });
        this.ga.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("Jin wants me to get the VIP tickets!", undefined, 'lucy-talk');
            })
        })
    }
}