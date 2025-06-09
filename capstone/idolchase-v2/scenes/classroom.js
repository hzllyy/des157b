import DialogueBox from "../ui/dialogueBox.js";

export default class ClassroomScene extends Phaser.Scene {
    constructor() {
        super('ClassroomScene');
    }

    preload() {
        //load bg
        this.load.image('bgclass', 'assets/classroom/bgclass.PNG');

        // load interactables
        this.load.image('window', 'assets/classroom/window.PNG');
        this.load.image('schooldesk', 'assets/classroom/schooldesk.PNG');
        this.load.image('bag', 'assets/classroom/bag.PNG');
        this.load.image('schooldoor', 'assets/hallway/classroomdoor.PNG');

        // load hover ui
        this.load.image('classdesk', 'assets/classroom/classdesk-select.PNG');
        this.load.image('bagselect', 'assets/classroom/bag-select.PNG');
        this.load.image('classdoor', 'assets/shared/classroomdoor-select.PNG');

        this.load.image('gluefound', 'assets/items/gluefound.png');
    }

    create() {
        // load bg
        this.bgclass = this.add.image(0, 0, 'bgclass').setOrigin(0, 0);
        this.bgclassX = 0;  
        this.minX = -(this.bgclass.width - this.sys.game.config.width);
        this.maxX = 0; 

        // items array
        this.itemsclasses = [];

        // create items and push
        // windows
        this.itemsclasses.push({
            sprite: this.add.image(150, 90, 'window'),
            x: 150
        });
        this.itemsclasses.push({
            sprite: this.add.image(300, 90, 'window'),
            x: 300
        });
        this.itemsclasses.push({
            sprite: this.add.image(450, 90, 'window'),
            x: 450
        });
        this.itemsclasses.push({
            sprite: this.add.image(600, 90, 'window'),
            x: 600
        });
        this.itemsclasses.push({
            sprite: this.add.image(750, 90, 'window'),
            x: 750
        });

        // desk
        const schooldesk = this.add.image(120, 169, 'schooldesk').setInteractive({useHandCursor: true})
        this.itemsclasses.push({
            sprite: schooldesk,
            x: 120
        });
        schooldesk.on('pointerdown', () => {
            this.scene.launch('SchoolCraftScene');
            this.scene.sleep();
        })
        schooldesk.on('pointerover', () => {
            schooldesk.setTexture('classdesk');
        } );
        schooldesk.on('pointerout', () => {
            schooldesk.setTexture('schooldesk');
        } )
        this.itemsclasses.push({
            sprite: this.add.image(270, 169, 'schooldesk'),
            x: 270
        });
        this.itemsclasses.push({
            sprite: this.add.image(420, 169, 'schooldesk'),
            x: 420
        });
        this.itemsclasses.push({
            sprite: this.add.image(570, 169, 'schooldesk'),
            x: 570
        });
        this.itemsclasses.push({
            sprite: this.add.image(720, 169, 'schooldesk'),
            x: 720
        });

        // load bag
        const bag = this.add.image(75, 157, 'bag').setInteractive({useHandCursor: true})
        this.itemsclasses.push({
            sprite: bag,
            x: 75
        });
        bag.on('pointerover', () => {
            bag.setTexture('bagselect');
        } );
        bag.on('pointerout', () => {
            bag.setTexture('bag');
        } );

        bag.on('pointerdown', () => {
            const itemScene = this.scene.launch('ItemScene', {
                name: 'gluefound'
            });
            this.scene.get('ItemScene').events.once('itemClosed', () => {
                this.playInventory();
            });
            this.registry.set('glueCheck', true);
            bag.setTexture('bag');
            bag.removeInteractive();
        })

        // load door
        this.schooldoorog = this.add.image(870, 131, 'schooldoor').setInteractive({useHandCursor: true})
        this.itemsclasses.push({
            sprite: this.schooldoorog,
            x: 870
        });
        this.schooldoorog.on('pointerdown', () => {
            this.registry.set('hallwayCheck', true);
            this.scene.launch('HallwayScene');
            this.scene.sleep();
        });
        this.schooldoorog.on('pointerover', () => {
            this.schooldoorog.setTexture('classdoor');
        })
        this.schooldoorog.on('pointerout', () => {
            this.schooldoorog.setTexture('schooldoor');
        })

        // load lucy
        this.lucy = this.add.sprite(224, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

        // read cursor input
        this.cursors = this.input.keyboard.createCursorKeys();

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

        this.time.delayedCall(1000, () => {
            this.dialogue.show("I want to make a note for Jin! Can you help me search the school for materials?");
        });

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

    updateItemPosition(itemclass, offset) {
        itemclass.x += offset;
        itemclass.sprite.x = itemclass.x;
    }

    updateAllItems(direction) {
        for (const itemclass of this.itemsclasses) {
            this.updateItemPosition(itemclass, direction);
        }
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

    update(time, delta) {
        // check if movement keys are pressed
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDown;

        const scrollSpeed = 0.175 * delta;

        if (this.cursors.left.isDown) {
            this.lucy.play('lucy-left', true);
            // Try to scroll bg
            const newBgClassX = Phaser.Math.Clamp(this.bgclassX + scrollSpeed, this.minX, this.maxX);

            // move items if bg is scrolling
            if (newBgClassX !== this.bgclassX) {
                this.bgclassX = newBgClassX;
                this.bgclass.x = this.bgclassX;
                this.updateAllItems(scrollSpeed);
            }
        } else if (this.cursors.right.isDown) {
            this.lucy.play('lucy-right', true);
            const newBgClassX = Phaser.Math.Clamp(this.bgclassX - scrollSpeed, this.minX, this.maxX);

            if (newBgClassX !== this.bgclassX) {
                this.bgclassX = newBgClassX;
                this.bgclass.x = this.bgclassX;
                this.updateAllItems(-scrollSpeed);
            }
        } else if (!isMoving) {
            this.lucy.play('lucy-idle', true);
        }
    }

    shutdown() {
        // Remove any remaining event listeners
        if (this.scene.get('ItemScene')) {
            this.scene.get('ItemScene').events.removeAllListeners('itemClosed');
        }
    }
}