import DialogueBox from "../ui/dialogueBox.js";

export default class CraftScene extends Phaser.Scene {
    constructor() {
        super('CraftScene');
    }

    preload() {
        this.load.image('bgcraft', 'assets/craft/bgcraft.PNG');
        this.load.image('center', 'assets/craft/center.PNG');

        // load scissors ann spool
        this.load.image('spool', 'assets/craft/spool.PNG');
        this.load.image('scissor', 'assets/craft/scissor.PNG');

        // load empty spaces
        this.load.image('box-space', 'assets/craft/box-space.PNG');
        this.load.image('button-space', 'assets/craft/button-space.PNG');
        this.load.image('cat-space', 'assets/craft/cat-place.PNG');
        this.load.image('cloth-space', 'assets/craft/cloth-space.PNG');

        // hover ui
        this.load.image('box-select', 'assets/craft/box-select.PNG');
        this.load.image('button-select', 'assets/craft/button-select.PNG');
        this.load.image('cat-select', 'assets/craft/cat-select.PNG');
        this.load.image('center-select', 'assets/craft/center-select.PNG');
        this.load.image('cloth-select', 'assets/craft/cloth-select.PNG');
        this.load.image('scissor-select', 'assets/craft/scissor-select.PNG');
        this.load.image('spool-select', 'assets/craft/spool-select.PNG');

        //load collectables
        this.load.image('cat', 'assets/craft/cat.PNG');
        this.load.image('button', 'assets/craft/button.PNG');
        this.load.image('cloth', 'assets/craft/cloth.PNG');
        this.load.image('boxbig', 'assets/craft/box.PNG');

        // steps
        this.load.image('base', 'assets/craft/base.PNG');
        this.load.image('face', 'assets/craft/face.PNG');
        this.load.image('hair', 'assets/craft/hair.PNG');
    }

    create() {
        this.add.image(0, 0, 'bgcraft').setOrigin(0, 0);

        // Check for all items collected first
        if (this.registry.get('clothCheck') && this.registry.get('catCheck') && this.registry.get('buttonCheck') && this.registry.get('boxCheck')) {
            console.log('all items collected.');
            this.registry.set('allRoomItemsCollected', true);
        }

        // Add back button
        this.backButton = document.createElement('button');
        this.backButton.id = 'craft-back-btn';
        this.backButton.textContent = 'BACK';
        this.backButton.onclick = () => {
            this.backButton.style.display = 'none';
            this.scene.wake('RoomScene');
            this.scene.sleep();
        };
        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.backButton);
        }

        //workspace
        const center = this.add.image(228, 130, 'center').setInteractive({useHandCursor: true});

        // spaces
        const box = this.add.image(370, 270, 'box-space').setInteractive({useHandCursor: true});
        const cat = this.add.image(70, 85, 'cat-space').setInteractive({useHandCursor: true});
        const button = this.add.image(330, 145, 'button-space').setInteractive({useHandCursor: true});
        const cloth = this.add.image(100, 230, 'cloth-space').setInteractive({useHandCursor: true});

        // tools
        const scissor = this.add.image(228, 50, 'scissor').setInteractive({useHandCursor: true});
        const spool = this.add.image(375, 115, 'spool').setInteractive({useHandCursor: true});

        // Store original positions
        const catOriginalX = 70;
        const catOriginalY = 85;

        const scissorOriginalX = 228;
        const scissorOriginalY = 50;

        const buttonOriginalX = 330;
        const buttonOriginalY = 145;

        const spoolOriginalX = 375;
        const spoolOriginalY = 115;

        const clothOriginalX = 100;
        const clothOriginalY = 230;
        
        const boxOriginalX = 370;
        const boxOriginalY = 270;

        // add hover events
        center.on('pointerover', () => {
            center.setTexture('center-select');
        });
        center.on('pointerout', () => {
            center.setTexture('center');
        });
        if (!this.catCenter) {
            center.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Drag items that you want to work on to this space.");
                })
            });
        }

        scissor.on('pointerover', () => {
            scissor.setTexture('scissor-select');
        });
        scissor.on('pointerout', () => {
            scissor.setTexture('scissor');
        });

        spool.on('pointerover', () => {
            spool.setTexture('spool-select');
        });
        spool.on('pointerout', () => {
            spool.setTexture('spool');
        });

        // conditions
        this.catCenter = false;
        this.buttonOn = false;
        this.faceOn = false;
        this.isBase = false;
        this.clothesOn = false;
        this.inBox = false;

        // get the bounds of the center image for snapback
        this.centerBounds = center.getBounds();

        if (!this.registry.get('allRoomItemsCollected')) {
            cat.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            }) 
            button.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            }) 
            box.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            }) 
            scissor.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            }) 
            spool.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            })
            cloth.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            })  
        }

        if (this.registry.get('catCheck') === true) {
            cat.setTexture('cat');
            if (this.registry.get('allRoomItemsCollected')) {
                cat.setInteractive({ draggable: true });
                this.input.setDraggable(cat);
            }

            cat.on('pointerover', () => {
                if (!this.isBase) {
                    cat.setTexture('cat-select');
                }
            });
            cat.on('pointerout', () => {
                if (!this.isBase) {
                    cat.setTexture('cat');
                }
            });

            // add drag events
            cat.on('dragstart', (pointer) => {
                if (!this.isBase) {
                    cat.setTexture('cat-select');
                }
            });

            cat.on('drag', (pointer, dragX, dragY) => {
                cat.x = dragX;
                cat.y = dragY;
            });

            cat.on('dragend', (pointer) => {
                if (!this.isBase) {
                    cat.setTexture('cat');
                }
                
                const catBounds = cat.getBounds();
                // check if the cat is overlapping with the center
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, catBounds)) {
                    // snap to center
                    cat.x = center.x;
                    cat.y = center.y;
                    this.catCenter = true;
                } else {
                    // return to original position
                    cat.x = catOriginalX;
                    cat.y = catOriginalY;
                }
            });

            scissor.on('dragend', () => {
                scissor.setTexture('scissor');
                const scissorBounds = scissor.getBounds();

                if (Phaser.Geom.Intersects.RectangleToRectangle(scissorBounds, this.centerBounds) && this.catCenter) {
                    cat.setTexture('base');
                    this.isBase = true;
                    scissor.setVisible(false);
                } else {
                    scissor.x = scissorOriginalX;
                    scissor.y = scissorOriginalY;
                }
            });
        }

        if (this.registry.get('buttonCheck') === true) {
            if (this.registry.get('allRoomItemsCollected')) {
                button.setInteractive({ draggable: true });
                this.input.setDraggable(button);
            }
            button.setTexture('button');

            button.on('pointerover', () => {
                button.setTexture('button-select');
            });
            button.on('pointerout', () => {
                button.setTexture('button');
            });

            // add drag events
            button.on('dragstart', (pointer) => {
                button.setTexture('button-select');
            });

            button.on('drag', (pointer, dragX, dragY) => {
                button.x = dragX;
                button.y = dragY;
            });

            button.on('dragend', (pointer) => {
                const buttonBounds = button.getBounds();
                // check if the cat is overlapping with the center
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, buttonBounds) && this.isBase) {
                    // snap to center
                    button.x = center.x;
                    button.y = center.y - 20;
                    this.buttonOn = true;
                } else {
                    // return to original position
                    button.x = buttonOriginalX;
                    button.y = buttonOriginalY;
                }
            });
        }
        if (this.registry.get('clothCheck') === true) {
            cloth.setTexture('cloth');
            if (this.registry.get('allRoomItemsCollected')) {
                cloth.setInteractive({ draggable: true });
                this.input.setDraggable(cloth);
            }

            cloth.on('pointerover', () => {
                cloth.setTexture('cloth-select');
            });
            cloth.on('pointerout', () => {
                cloth.setTexture('cloth');
            });

            cloth.on('drag', (pointer, dragX, dragY) => {
                cloth.x = dragX;
                cloth.y = dragY;
            });

            cloth.on('dragend', (pointer) => {
                const clothBounds = cloth.getBounds();
                // check if the cat is overlapping with the center
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, clothBounds) && this.faceOn) {
                    cloth.setVisible(false);
                    this.hair = this.add.image(228, 125, 'hair');
                    this.clothesOn = true;
                } else {
                    // return to original position
                    cloth.x = clothOriginalX;
                    cloth.y = clothOriginalY;
                }
            });
        }
        if (this.registry.get('boxCheck') === true) {
            box.setTexture('boxbig');
            if (this.registry.get('allRoomItemsCollected')) {
                box.setInteractive({ draggable: true });
                this.input.setDraggable(box);
            }

            box.on('pointerover', () => {
                box.setTexture('box-select');
            });
            box.on('pointerout', () => {
                box.setTexture('boxbig');
            });

            box.on('drag', (pointer, dragX, dragY) => {
                box.x = dragX;
                box.y = dragY;
            });

            box.on('dragend', (pointer) => {
                const boxBounds = box.getBounds();
                // check if the cat is overlapping with the center
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, boxBounds) && this.clothesOn) {
                    box.x = center.x;
                    box.y = center.y;
                    this.inBox = true;
                    
                    // show dialogue and launch item scene when box is placed
                    this.time.delayedCall(200, () => {
                        this.dialogue.show("Yay! This looks perfect!");
                    });
                    this.time.delayedCall(2000, () => {
                        this.scene.launch('ItemScene', {
                            name: 'giftcreated'
                        });
                    });
                    this.registry.set('giftCreated', true);
                } else {
                    // return to original position
                    box.x = boxOriginalX;
                    box.y = boxOriginalY;
                }
            });
        }

        // add drag events for scissor
        if (this.registry.get('allRoomItemsCollected')) {
            this.input.setDraggable(scissor);
        }
            
        scissor.on('dragstart', (pointer) => {
            scissor.setTexture('scissor-select');
        });

        scissor.on('drag', (pointer, dragX, dragY) => {
            scissor.x = dragX;
            scissor.y = dragY;
        });

        scissor.on('dragend', () => {
            scissor.setTexture('scissor');
            const scissorBounds = scissor.getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(scissorBounds, this.centerBounds) && this.catCenter) {
                cat.setTexture('base');
                scissor.setVisible(false);
            } else {
                scissor.x = scissorOriginalX;
                scissor.y = scissorOriginalY;
            }
        });

        // add drag events for spool
        if (this.registry.get('allRoomItemsCollected')) {
            this.input.setDraggable(spool);
        }
    
        spool.on('dragstart', (pointer) => {
            spool.setTexture('spool-select');
        });

        spool.on('drag', (pointer, dragX, dragY) => {
            spool.x = dragX;
            spool.y = dragY;
        });

        spool.on('dragend', (pointer) => {
            spool.setTexture('spool');

            const buttonBounds = button.getBounds();
            
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, buttonBounds) && this.buttonOn) {
                this.face = this.add.image(228, 110, 'face');
                button.setVisible(false);
                spool.setVisible(false);
                this.faceOn = true;
            } else {
                // return to original position
                spool.x = spoolOriginalX;
                spool.y = spoolOriginalY;
            }
        });

        //dialogue
        this.dialogue = new DialogueBox(this, 150, 256, 'lucy-talk');

        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (currentlyOver.length > 0 && currentlyOver.includes(this.lucy)) return;
        
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });
    }

    shutdown() {
        // Remove back button when leaving the scene
        if (this.backButton && this.backButton.parentElement) {
            this.backButton.parentElement.removeChild(this.backButton);
        }
    }
} 