import DialogueBox from "../ui/dialogueBox.js";

export default class BookcaseScene extends Phaser.Scene {
    constructor() {
        super('BookcaseScene');
    }

    preload() {
        this.load.image('bookshelf-close', 'assets/bookcase/bookshelf-close.PNG');
        this.load.image('shakespeare', 'assets/bookcase/shakespeare.PNG');
        this.load.image('shakespeare-select', 'assets/bookcase/shakespeare-select.PNG');
        this.load.image('shakespeare-torn', 'assets/bookcase/shakespeare-torn.PNG');
        this.load.image('befound', 'assets/items/befound.png');
    }

    create() {
         // back button
         this.backButton = document.createElement('button');
         this.backButton.id = 'bookcase-back-btn';
         this.backButton.textContent = 'BACK';
         this.backButton.onclick = () => {
             this.backButton.style.display = 'none';
             this.scene.wake('LibraryScene');
             this.scene.sleep();
         }
 
         const canvas = document.querySelector('canvas');
         const gameContainer = canvas.parentElement;
         if (gameContainer) {
             gameContainer.appendChild(this.backButton);
         }

        this.add.image(0, 0, 'bookshelf-close').setOrigin(0, 0);

        if (!this.registry.get('beCheck')) {
            this.shakespeare = this.add.image(337, 128, 'shakespeare')
                .setInteractive({useHandCursor: true});

            this.shakespeare.on('pointerover', () => {
                this.shakespeare.setTexture('shakespeare-select');
            });
            this.shakespeare.on('pointerout', () => {
                this.shakespeare.setTexture('shakespeare');
            });
            this.shakespeare.on('pointerdown', () => {
                const ItemScene = this.scene.launch('ItemScene', {
                    name: 'befound'
                });
                this.scene.get('ItemScene').events.once('itemClosed', () => {
                    this.playInventory();
                });
                this.registry.set('beCheck', true);
                this.shakespeare.setTexture('shakespeare-torn');
                this.shakespeare.removeInteractive();
            });
        } else {
            this.shakespeare = this.add.image(337, 128, 'shakespeare-torn');
        }

        this.inventory = this.add.image(380, 250, 'inventory').setInteractive({useHandCursor: true}).setOrigin(0.5, 1);

        this.inventory.on('pointerover', () => {
            this.inventory.setTexture('inventory-select');
        })
        this.inventory.on('pointerout', () => {
            this.inventory.setTexture('inventory');
        })
        this.inventory.on('pointerdown', () => {
            this.scene.launch('ClassInventory');
        })

        this.dialogue = new DialogueBox(this, 150, 256, 'lucy-talk');
        
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

        this.input.on('pointerdown', (pointer) => {
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });
    }

    playInventory() {
        this.time.delayedCall(100, () => {
            this.inventory.setTexture('inventory-select');
            this.time.delayedCall(100, () => {
                this.inventory.setTexture('inventory');
                this.time.delayedCall(100, () => {
                    this.inventory.setTexture('inventory-select');
                    this.time.delayedCall(100, () => {
                        this.inventory.setTexture('inventory');
                        this.time.delayedCall(100, () => {
                            this.inventory.setTexture('inventory-select');
                            this.time.delayedCall(100, () => {
                                this.inventory.setTexture('inventory');
                            })
                        })
                    })
                })
            })
        })
    }
}