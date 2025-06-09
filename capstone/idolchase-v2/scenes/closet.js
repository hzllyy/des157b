import DialogueBox from "../ui/dialogueBox.js";

export default class ClosetScene extends Phaser.Scene {
    constructor() {
        super('ClosetScene');
    }

    preload() {
        // load background
        this.load.image('closetbg', 'assets/closet/closet-bg.PNG');

        // load clothes
        this.load.image('clothes1', 'assets/closet/clothes-1.PNG');
        this.load.image('clothes2', 'assets/closet/clothes-2.PNG');
        this.load.image('clothes3', 'assets/closet/clothes-3.PNG');
        this.load.image('clothes4', 'assets/closet/clothes-4.PNG');
        this.load.image('clothes5', 'assets/closet/clothes-5.PNG');
        this.load.image('select', 'assets/closet/clothes-select.PNG');

        // load door
        this.load.image('doorblue', 'assets/closet/door-blue.PNG');

        // load hover ui
        this.load.image('clothes1hover', 'assets/closet/clothes-1-select.PNG');
        this.load.image('clothes2hover', 'assets/closet/clothes-2-select.PNG');
        this.load.image('clothes3hover', 'assets/closet/clothes-3-select.PNG');
        this.load.image('clothes4hover', 'assets/closet/clothes-4-select.PNG');
        this.load.image('clothes5hover', 'assets/closet/clothes-5-select.PNG');
        this.load.image('clothespickhover', 'assets/closet/clothes-pick-select.PNG');
        this.load.image('closetdoorhover', 'assets/closet/closet-door-select.PNG');

    }

    create() {
        // load bg
        this.closetbg = this.add.image(0, 0, 'closetbg').setOrigin(0, 0);

        // load door and lead back to room
        const doorblue = this.add.image(395, 121, 'doorblue').setInteractive({useHandCursor: true})
        doorblue.on('pointerdown', () => {
            this.scene.wake('RoomScene');
            this.scene.sleep();
        });
        doorblue.on('pointerover', () => {
            doorblue.setTexture('closetdoorhover')
        })
        doorblue.on('pointerout', () => {
            doorblue.setTexture('doorblue')
        })

        const clothes1 = this.add.image(288, 40, 'clothes1').setInteractive({useHandCursor: true});
        clothes1.on('pointerover', () => {
            clothes1.setTexture('clothes1hover')
        })
        clothes1.on('pointerout', () => {
            clothes1.setTexture('clothes1')
        })
        clothes1.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("There's nothing useful here.");
            })
        })

        const clothes2 = this.add.image(288, 100, 'clothes2').setInteractive({useHandCursor: true});
        clothes2.on('pointerover', () => {
            clothes2.setTexture('clothes2hover')
        })
        clothes2.on('pointerout', () => {
            clothes2.setTexture('clothes2')
        })
        clothes2.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("There's nothing useful here.");
            })
        })

       const clothes3 = this.add.image(174, 118, 'clothes3').setInteractive({useHandCursor: true});
       clothes3.on('pointerover', () => {
            clothes3.setTexture('clothes3hover')
        })
        clothes3.on('pointerout', () => {
            clothes3.setTexture('clothes3')
        })
        clothes3.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("There's nothing useful here.");
            })
        })

        const clothes4 = this.add.image(64, 63, 'clothes4').setInteractive({useHandCursor: true});
        clothes4.on('pointerover', () => {
            clothes4.setTexture('clothes4hover')
        })
        clothes4.on('pointerout', () => {
            clothes4.setTexture('clothes4')
        })
        clothes4.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("There's nothing useful here.");
            })
        })

        const clothes5 = this.add.image(64, 97, 'clothes5').setInteractive({useHandCursor: true})
        clothes5.on('pointerover', () => {
            clothes5.setTexture('clothes5hover')
        })
        clothes5.on('pointerout', () => {
            clothes5.setTexture('clothes5')
        })
        clothes5.on('pointerdown', () => {
            this.time.delayedCall(100, () => {
                this.dialogue.show("There's nothing useful here.");
            })
        })

        if (!this.registry.get('clothCheck')) {
            const clothespick = this.add.image(64, 37, 'select').setInteractive({useHandCursor: true});
            clothespick.on('pointerover', () => {
                clothespick.setTexture('clothespickhover')
            })
            clothespick.on('pointerout', () => {
                clothespick.setTexture('select')
            })
            clothespick.on('pointerdown', () => {
                const itemScene = this.scene.launch('ItemScene', {
                    name: 'clothfound'
                });
                this.scene.get('ItemScene').events.once('itemClosed', () => {
                    this.playInventory();
                });
                this.registry.set('clothCheck', true);
                clothespick.removeInteractive();
                clothespick.setVisible(false);
            })
        }

        // add lucy
        this.lucy = this.add.sprite(347, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

        const phone = this.add.image(420, 250, 'phone').setInteractive({useHandCursor: true}).setOrigin(0.5, 1);
        this.inventory = this.add.image(380, 250, 'inventory').setInteractive({useHandCursor: true}).setOrigin(0.5, 1);

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
            this.scene.launch('InventoryScene');
        })
        
        // add dialogue
        this.dialogue = new DialogueBox(this, 150, 256, 'lucy-talk');

        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (currentlyOver.length > 0 && currentlyOver.includes(this.lucy)) return;
        
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

    update() {

    }
}