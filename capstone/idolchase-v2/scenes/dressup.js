import DialogueBox from "../ui/dialogueBox.js";

export default class DressUpScene extends Phaser.Scene {
    constructor() {
        super('DressUpScene');
    }


    preload() {
        // load background
        this.load.image('closet', 'assets/dressup/closet.PNG');
        this.load.image('set-button', 'assets/dressup/button.PNG');
        this.load.image('button-hover', 'assets/dressup/button-hover.PNG');

        // load sprites with fits
        this.load.image('lucy-clean-1', 'assets/dressup/lucy-clean-1.PNG');
        this.load.image('lucy-clean-2', 'assets/dressup/lucy-clean-2.PNG');

        this.load.image('lucy-amu-1', 'assets/dressup/lucy-amu-1.PNG');
        this.load.image('lucy-amu-2', 'assets/dressup/lucy-amu-2.PNG');

        this.load.image('lucy-pigtails-1', 'assets/dressup/lucy-pigtails-1.PNG');
        this.load.image('lucy-pigtails-2', 'assets/dressup/lucy-pigtails-2.PNG');

        this.load.image('lucy-y2k-1', 'assets/dressup/lucy-y2k.PNG');
        this.load.image('lucy-y2k-2', 'assets/dressup/lucy-y2k-2.PNG');

        this.load.image('lucy-wedding-1', 'assets/dressup/lucy-wedding-1.PNG');
        this.load.image('lucy-wedding-2', 'assets/dressup/lucy-wedding-2.PNG');

        // load clothing items
        this.load.image('brown-dress', 'assets/dressup/brown-dress.PNG');
        this.load.image('red-dress', 'assets/dressup/red-dress.PNG');
        this.load.image('jeans', 'assets/dressup/jeans.PNG');
        this.load.image('purple-shirt', 'assets/dressup/purple-shirt.PNG');
        this.load.image('wedding-dress', 'assets/dressup/wedding-dress.PNG');

        // load highlights
        this.load.image('highlight-1', 'assets/dressup/highlight-1.PNG');
        this.load.image('highlight-2', 'assets/dressup/highlight-2.PNG');
        this.load.image('highlight-3', 'assets/dressup/highlight-3.PNG');
        this.load.image('highlight-4', 'assets/dressup/highlight-4.PNG');
        this.load.image('highlight-5', 'assets/dressup/highlight-5.PNG');

        // load dialogue boxes
        this.load.image('clean-lucy-talk', 'assets/dressup/clean-lucy-dialogue.PNG');
        this.load.image('pigtail-lucy-talk', 'assets/dressup/pigtail-lucy-dialogue.PNG');
        this.load.image('amu-lucy-talk', 'assets/dressup/amu-lucy-dialogue.PNG');
        this.load.image('y2k-lucy-talk', 'assets/dressup/y2k-lucy-dialogue.PNG');
    }

    create() {
        // create idle animations
        this.anims.create({
            key: 'lucy-clean',
            frames: [
                {key: 'lucy-clean-1'},
                {key: 'lucy-clean-2'}
            ],
            frameRate: 2.5,
            repeat: -1
        });

        this.anims.create({
            key: 'lucy-pigtails',
            frames: [
                {key: 'lucy-pigtails-1'},
                {key: 'lucy-pigtails-2'}
            ],
            frameRate: 2.5,
            repeat: -1
        });

        this.anims.create({
            key: 'lucy-amu',
            frames: [
                {key: 'lucy-amu-1'},
                {key: 'lucy-amu-2'}
            ],
            frameRate: 2.5,
            repeat: -1
        });

        this.anims.create({
            key: 'lucy-y2k',
            frames: [
                {key: 'lucy-y2k-1'},
                {key: 'lucy-y2k-2'}
            ],
            frameRate: 2.5,
            repeat: -1
        });

        this.anims.create({
            key: 'lucy-wedding',
            frames: [
                {key: 'lucy-wedding-1'},
                {key: 'lucy-wedding-2'}
            ],
            frameRate: 2.5,
            repeat: -1
        });

        const currentOutfit = '';

        // load background
        this.add.image(0,0, 'closet').setOrigin(0,0);

        // lucy with default fit
        this.lucy = this.add.sprite(280, 145, 'lucy-idle-1').play('lucy-idle');
        this.currentOutfit = 'lucy-idle';

        // load clothing items
        const brownDress = this.add.image(137, 87, 'brown-dress').setOrigin(0, 0).setInteractive({useHandCursor: true});
        const purpleShirt = this.add.image(153, 87, 'purple-shirt').setOrigin(0, 0).setInteractive({useHandCursor: true});
        const redDress = this.add.image(174, 87, 'red-dress').setOrigin(0, 0).setInteractive({useHandCursor: true});
        const jeans = this.add.image(193, 87, 'jeans').setOrigin(0, 0).setInteractive({useHandCursor: true});
        const weddingDress = this.add.image(211, 87, 'wedding-dress').setOrigin(0, 0).setInteractive({useHandCursor: true});        

        // load highlights
        const highlight1 = this.add.image(137, 87, 'highlight-1').setOrigin(0, 0).setVisible(false);
        const highlight2 = this.add.image(153, 87, 'highlight-2').setOrigin(0, 0).setVisible(false);
        const highlight3 = this.add.image(174, 87, 'highlight-3').setOrigin(0, 0).setVisible(false);
        const highlight4 = this.add.image(193, 87, 'highlight-4').setOrigin(0, 0).setVisible(false);
        const highlight5 = this.add.image(211, 87, 'highlight-5').setOrigin(0, 0).setVisible(false);

        // clothing and their associated animations
        brownDress.on('pointerdown', () => {
            this.lucy.play('lucy-clean');
            this.currentOutfit = 'lucy-clean';
        });
        
        purpleShirt.on('pointerdown', () => {
            this.lucy.play('lucy-pigtails');
            this.currentOutfit = 'lucy-pigtails'
        });

        redDress.on('pointerdown', () => {
            this.lucy.play('lucy-amu');
            this.currentOutfit = 'lucy-amu';
        });

        jeans.on('pointerdown', () => {
            this.lucy.play('lucy-y2k');
            this.currentOutfit = 'lucy-y2k';
        });

        weddingDress.on('pointerdown', () => {
            this.lucy.play('lucy-wedding');
            this.currentOutfit = 'lucy-wedding';
    });

        // hover ui
        brownDress.on('pointerover', () => highlight1.setVisible(true));
        brownDress.on('pointerout', () => highlight1.setVisible(false));

        purpleShirt.on('pointerover', () => highlight2.setVisible(true));
        purpleShirt.on('pointerout', () => highlight2.setVisible(false));

        redDress.on('pointerover', () => highlight3.setVisible(true));
        redDress.on('pointerout', () => highlight3.setVisible(false));

        jeans.on('pointerover', () => highlight4.setVisible(true));
        jeans.on('pointerout', () => highlight4.setVisible(false));

        weddingDress.on('pointerover', () => highlight5.setVisible(true));
        weddingDress.on('pointerout', () => highlight5.setVisible(false));

        // handle audio error
        this.input.once('pointerdown', () => {
            if (this.sound.context.state === 'suspended') {
              this.sound.context.resume();
            }
        });

        // button to move on to the next scene (in theory)
        const button = this.add.image(280, 45, 'set-button')
            .setInteractive({useHandCursor: true})
            .setOrigin(0.5, 0.5);

        // Add hover effects
        button.on('pointerover', () => {
            button.setTexture('button-hover');
        });

        button.on('pointerout', () => {
            button.setTexture('set-button');
        });

        // dialogue run and skip
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (currentlyOver.length > 0 && currentlyOver.includes(button)) return;
        
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });

        // create dialogue boxes
        this.dialogue = new DialogueBox(this, 150, 256, 'lucy-talk');

        const outfitToDialogue = {
            'lucy-idle': 'lucy-talk',
            'lucy-clean': 'clean-lucy-talk',
            'lucy-pigtails': 'pigtail-lucy-talk',
            'lucy-amu': 'amu-lucy-talk',
            'lucy-y2k': 'y2k-lucy-talk',
            'lucy-wedding': 'wedding-talk-happy'
        }

        this.time.delayedCall(1000, () => {
            this.dialogue.show("Can you help me pick what to wear to the meet and greet?");
        });

        button.on('pointerdown', () => {
            const bgKey = outfitToDialogue[this.currentOutfit] || 'lucy-talk';
            this.dialogue.bg.setTexture(bgKey);

            console.log(currentOutfit);

            if (this.currentOutfit === 'lucy-wedding') {
                this.dialogue.show("I love it! I'm ready to go!", null, bgKey);
                this.time.delayedCall(2000, () => {
                    this.scene.start('MeetScene');
                    this.dialogue.hide();
                })

            } else {
                this.dialogue.show("I don't know... I think I feel like wearing something else.", null, bgKey);
            }
        });


    }
}