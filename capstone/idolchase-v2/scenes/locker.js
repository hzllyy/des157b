import DialogueBox from "../ui/dialogueBox.js";

export default class LockerScene extends Phaser.Scene{
    constructor() {
        super('LockerScene')
    }

    preload() {
        this.load.image('binder-select', 'assets/locker/binder-select.PNG');
        this.load.image('binder', 'assets/locker/binder.PNG');
        this.load.image('locker-bg', 'assets/locker/locker-background.PNG');
        this.load.image('binder-select', 'assets/locker/binder-select.PNG');
        this.load.image('closed-select', 'assets/locker/locker-closed-select.PNG');
        this.load.image('closed', 'assets/locker/locker-closed.PNG');
        this.load.image('open', 'assets/locker/locker-open.PNG');
        this.load.image('minefound', 'assets/items/minefound.png');
        this.load.image('paperfound', 'assets/items/paperfound.png');
        this.load.image('bottom', 'assets/locker/poster-bottom.PNG');
        this.load.image('bottom-select', 'assets/locker/poster-bottom-select.PNG');
        this.load.image('top', 'assets/locker/poster-top.PNG');
        this.load.image('top-select', 'assets/locker/poster-top-select.PNG');
        this.load.image('ripped', 'assets/locker/poster-ripped.PNG');
    }

    create() {
        this.add.image(0, 0, 'locker-bg').setOrigin(0, 0);
        const locker = this.add.image(222, 126, 'closed').setInteractive({useHandCursor: true});
        this.open = this.add.image(265, 126, 'open').setInteractive({useHandCursor: true}).setVisible(false);
        this.binder = this.add.image(235, 112, 'binder').setInteractive({useHandCursor: true}).setVisible(false);
        this.top = this.add.image(305, 80, 'top').setInteractive({useHandCursor: true}).setVisible(false);
        this.bottom = this.add.image(320, 165, 'bottom').setInteractive({useHandCursor: true}).setVisible(false);
        this.ripped = this.add.image(320, 165, 'ripped').setVisible(false);

        // back button
        this.backButton = document.createElement('button');
        this.backButton.id = 'locker-back-btn';
        this.backButton.textContent = 'BACK';
        this.backButton.onclick = () => {
            this.backButton.style.display = 'none';
            this.scene.wake('HallwayScene');
            this.scene.sleep();
        }

        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.backButton);
        }

        locker.on('pointerover', () => {
            locker.setTexture('closed-select');
        })
        locker.on('pointerout', () => {
            locker.setTexture('closed');
        })
        // open locker
        locker.on('pointerdown', () => {
            this.open.setVisible(true);
            this.binder.setVisible(true);
            this.top.setVisible(true);
            this.bottom.setVisible(true);

            if (this.registry.get('paperCheck')) {
                this.binder.setVisible(false);
            }

            if (this.registry.get('mineCheck')) {
                this.ripped.setVisible(true);
            }
        })

        // close locker
        this.open.on('pointerdown', () => {
            this.open.setVisible(false);
            this.binder.setVisible(false);
            this.top.setVisible(false);
            this.bottom.setVisible(false);
            this.ripped.setVisible(false);
        })

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

        this.phone = this.add.image(420, 250, 'phone').setInteractive({useHandCursor: true}).setOrigin(0.5, 1);
        this.phone.on('pointerover', () => {
            this.phone.setTexture('phone-select');
        });
        this.phone.on('pointerout', () => {
            this.phone.setTexture('phone');
        });
        this.phone.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("I don't have any notifications right now.", undefined, 'lucy-talk');
            })
        });

        this.binder.on('pointerover', () => {
            this.binder.setTexture('binder-select');
        })
        this.binder.on('pointerout', () => {
            this.binder.setTexture('binder');
        })
        this.binder.on('pointerdown', () => {
            const ItemScene = this.scene.launch('ItemScene', {
                name: 'paperfound'
            })
            this.top.removeInteractive();
            this.bottom.removeInteractive();
            this.open.removeInteractive();
            this.phone.disableInteractive();
            this.inventory.disableInteractive();
            this.scene.get('ItemScene').events.once('itemClosed', () => {
                this.playInventory();
                this.top.setInteractive({useHandCursor: true});
                this.bottom.setInteractive({useHandCursor: true});
                this.open.setInteractive({useHandCursor: true});
                this.inventory.setInteractive({useHandCursor: true});
                this.phone.setInteractive({useHandCursor: true});
            });
            this.binder.setVisible(false);
            this.registry.set('paperCheck', true)
        })

        this.dialogue = new DialogueBox(this, 150, 256, 'lucy-talk');

        this.input.on('pointerdown', (pointer) => {
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
    })

        this.top.on('pointerover', () => {
            this.top.setTexture('top-select');
        })
        this.top.on('pointerout', () => {
            this.top.setTexture('top');
        })
        this.top.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("Isn't he just soooo cute??");
            });
        })

        this.bottom.on('pointerover', () => {
            this.bottom.setTexture('bottom-select');
        })
        this.bottom.on('pointerout', () => {
            this.bottom.setTexture('bottom');
        })
        this.bottom.on('pointerdown', () => {
            const ItemScene = this.scene.launch('ItemScene', {
                name: 'minefound'
            })
            this.top.removeInteractive();
            this.binder.removeInteractive();
            this.open.removeInteractive();
            this.phone.disableInteractive();
            this.inventory.disableInteractive();
            this.scene.get('ItemScene').events.once('itemClosed', () => {
                this.playInventory();
                this.top.setInteractive({useHandCursor: true});
                this.binder.setInteractive({useHandCursor: true});
                this.open.setInteractive({useHandCursor: true});
                this.phone.setInteractive({useHandCursor: true});
                this.inventory.setInteractive({useHandCursor: true});
            });
            this.registry.set('mineCheck', true);
            this.ripped.setVisible(true);
            this.bottom.setTexture('bottom');
            this.bottom.removeInteractive();
        })

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