import DialogueBox from "../ui/dialogueBox.js";

export default class RoomScene extends Phaser.Scene {
    constructor() {
        super('RoomScene');
    }

    preload() {
        // load background
        this.load.image('bg', 'assets/room/room.PNG');

        // load interactables
        this.load.image('box', 'assets/room/box.PNG');
        this.load.image('coat', 'assets/room/coat-hanger.PNG');
        this.load.image('desk', 'assets/room/desk.PNG');
        this.load.image('doll', 'assets/room/plush.PNG');
        this.load.image('door', 'assets/room/door1.PNG');
        this.load.image('posters', 'assets/room/poster.PNG');
        this.load.image('vanity', 'assets/room/vanity.PNG');

        // hover ui
        this.load.image('doll-select', 'assets/room/plush-select.PNG');
        this.load.image('select-box', 'assets/room/box-select.PNG');
        this.load.image('desk-select', 'assets/room/desk-select.PNG');
        this.load.image('hanger-select', 'assets/room/hanger-select.PNG');
        this.load.image('poster-select', 'assets/room/poster-select.PNG');
        this.load.image('door-select', 'assets/room/door-select.PNG');

    }

    create() {
        // load bg
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.bgX = 0;  
        this.minX = -(this.bg.width - this.sys.game.config.width);
        this.maxX = 0; 

        // items array
        this.items = [];

        // create interactable items and push
        const doll = this.add.image(405, 129, 'doll').setInteractive({useHandCursor: true});
        this.items.push({
            sprite: doll,
            x: 405
        });
        doll.on('pointerover', () => {
            doll.setTexture('doll-select')
        })
        doll.on('pointerout', () => {
            doll.setTexture('doll')
        })
        doll.on('pointerdown', () => {
            this.scene.launch('ItemScene', {
                name: 'catfound'
            })
            this.registry.set('catCheck', true);
            doll.removeInteractive();
            doll.setVisible(false);
        })

        const poster = this.add.image(390, 70, 'posters').setInteractive({useHandCursor: true});
        this.items.push({
            sprite: poster,
            x: 390
        });
        poster.on('pointerover', () => {
            poster.setTexture('poster-select')
        })
        poster.on('pointerout', () => {
            poster.setTexture('posters')
        })

        const box = this.add.image(388, 181, 'box').setInteractive({useHandCursor: true});
        this.items.push({
            sprite: box,
            x: 388
        });
        box.on('pointerover', () => {
            box.setTexture('select-box')
        })
        box.on('pointerout', () => {
            box.setTexture('box')
        })
        box.on('pointerdown', () => {
            this.scene.launch('ItemScene', {
                name: 'boxFound'
            })
            this.registry.set('boxCheck', true);
            box.setTexture('box');
            box.removeInteractive();
            box.setVisible(false);
        })

        this.items.push({
            sprite: this.add.image(600, 138, 'vanity'),
            x: 600
        });

        const door = this.add.image(720, 113, 'door').setInteractive({useHandCursor: true});
        door.on('pointerdown', () => {
            this.scene.launch('ClosetScene');
            this.scene.sleep();
        });
        this.items.push({
            sprite: door,
            x: 720
        });
        door.on('pointerover', () => {
            door.setTexture('door-select')
        });
        door.on('pointerout', () => {
            door.setTexture('door')
        });

        const desk = this.add.image(845, 157, 'desk').setInteractive({useHandCursor: true})
        this.items.push({
            sprite: desk,
            x: 845
        });
        desk.on('pointerdown', () => {
            this.scene.launch('CraftScene');
            this.scene.sleep();
        });
        desk.on('pointerover', () => {
            desk.setTexture('desk-select')
        });
        desk.on('pointerout', () => {
            desk.setTexture('desk')
        });

        this.items.push({
            sprite: this.add.image(1030, 123, 'coat'),
            x: 1030
        });

        const door2 = this.add.image(1105, 113, 'door').setInteractive({useHandCursor: true});
        door2.on('pointerdown', () => {
            if (this.registry.get('giftCreated')) {
                this.scene.start('ClassroomScene');
            } else {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("I should finish making my gift before I go to school.");
                });
            }
            
        });
        this.items.push({
            sprite: door2,
            x: 1105
        });
        door2.on('pointerover', () => {
            door2.setTexture('door-select')
        });
        door2.on('pointerout', () => {
            door2.setTexture('door')
        });

        const hanger = this.add.image(1030, 123, 'coat').setInteractive({useHandCursor: true});
        this.items.push({
            sprite: hanger,
            x: 1030
        });
        hanger.on('pointerover', () => {
            if (hanger.input) { 
                hanger.setTexture('hanger-select')
            }
        });
        hanger.on('pointerout', () => {
            if (hanger.input) { 
                hanger.setTexture('coat')
            }
        });
        hanger.on('pointerdown', () => {
            this.scene.launch('ItemScene', {
                name: 'buttonFound'
            })
            this.registry.set('buttonCheck', true);
            hanger.setTexture('coat');
            hanger.removeInteractive();
        })
        

        // load lucy
        this.lucy = this.add.sprite(224, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

        // read cursor input
        this.cursors = this.input.keyboard.createCursorKeys();

        // dialogue
        this.dialogue = new DialogueBox(this, 150, 256, 'lucy-talk');

        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (currentlyOver.length > 0 && currentlyOver.includes(this.june)) return;
        
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });

        this.time.delayedCall(1000, () => {
            this.dialogue.show("I need to make the perfect gift for my idol. Can you help me search my room for materials?");
        });
    }

    updateItemPosition(item, direction) {
        const newX = item.x + (direction * 1.5);
        item.sprite.x = newX;
        item.x = newX;
    }

    updateAllItems(direction) {
        for (const item of this.items) {
            this.updateItemPosition(item, direction);
        }
    }

    update() {
        // check if movement keys are pressed
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDown;

        if (this.cursors.left.isDown) {
            this.lucy.play('lucy-left', true);
            // Try to scroll bg
            const newBgX = Phaser.Math.Clamp(this.bgX + 1.5, this.minX, this.maxX);

            // move items if bg is scrolling
            if (newBgX !== this.bgX) {
                this.bgX = newBgX;
                this.bg.x = this.bgX;
                this.updateAllItems(1);
            }
        } else if (this.cursors.right.isDown) {
            this.lucy.play('lucy-right', true);
            const newBgX = Phaser.Math.Clamp(this.bgX - 1.5, this.minX, this.maxX);

            if (newBgX !== this.bgX) {
                this.bgX = newBgX;
                this.bg.x = this.bgX;
                this.updateAllItems(-1);
            }
        } else if (!isMoving) {
            this.lucy.play('lucy-idle', true);
        }
    }
} 