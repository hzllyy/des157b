import DialogueBox from "../ui/dialogueBox.js";

export default class SchoolCraftScene extends Phaser.Scene{
    constructor() {
        super('SchoolCraftScene');
    }

    preload() {
        this.load.image('class-craft-bg', 'assets/schoolcraft/classroom-craft-bg.PNG');
        this.load.image('be', 'assets/schoolcraft/be.PNG');
        this.load.image('be-select', 'assets/schoolcraft/be-select.PNG');
        this.load.image('be-space', 'assets/schoolcraft/be-space.PNG');
        this.load.image('glue', 'assets/schoolcraft/glue.PNG');
        this.load.image('glue-select', 'assets/schoolcraft/glue-select.PNG');
        this.load.image('glue-space', 'assets/schoolcraft/glue-space.PNG');
        this.load.image('glue-spots', 'assets/schoolcraft/glue-spots.PNG');
        this.load.image('lettercreated', 'assets/items/lettercreated.png');
        this.load.image('mine', 'assets/schoolcraft/mine.PNG');
        this.load.image('mine-select', 'assets/schoolcraft/mine-select.PNG');
        this.load.image('mine-space', 'assets/schoolcraft/mine-space.PNG');
        this.load.image('paper', 'assets/schoolcraft/paper.PNG');
        this.load.image('paper-select', 'assets/schoolcraft/paper-select.PNG');
        this.load.image('paper-space', 'assets/schoolcraft/paper-space.PNG');
        this.load.image('center', 'assets/craft/center.PNG');
        this.load.image('center-select', 'assets/craft/center-select.PNG');
    }

    create() {
        this.add.image(0, 0, 'class-craft-bg').setOrigin(0, 0);

        if (this.registry.get('paperCheck') && this.registry.get('glueCheck') && this.registry.get('beCheck') && this.registry.get('mineCheck')) {
            this.registry.set('allSchoolItemsCollected', true);
        }

        // Add back button
        this.backButton = document.createElement('button');
        this.backButton.id = 'schoolcraft-back-btn';
        this.backButton.textContent = 'BACK';
        this.backButton.onclick = () => {
            if (this.backButton && this.backButton.parentElement) {
                this.backButton.parentElement.removeChild(this.backButton);
            }
            this.scene.wake('ClassroomScene');
            this.scene.sleep();
        };
        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.backButton);
        }

        const center = this.add.image(228, 130, 'center').setInteractive({useHandCursor: true});

        center.on('pointerover', () => {
            center.setTexture('center-select');
        });
        center.on('pointerout', () => {
            center.setTexture('center');
        });

        // spaces

        const paper = this.add.image(70, 185, 'paper-space').setInteractive({useHandCursor: true});
        const glue = this.add.image(350, 120, 'glue-space').setInteractive({useHandCursor: true});
        this.glueSpots = this.add.image(224, 128, 'glue-spots').setVisible(false);
        const be = this.add.image(120, 50, 'be-space').setInteractive({useHandCursor: true});
        const mine = this.add.image(320, 220, 'mine-space').setInteractive({useHandCursor: true});
        

        // set og positions
        const glueOgX = 350;
        const glueOgY = 120;
        const paperOgX = 70;
        const paperOgY = 185;
        const beOgX = 120;
        const beOgY = 50;
        const mineOgX = 320;
        const mineOgY = 220;

        // conditions
        this.paperCenter = false;
        this.glueOn = false;
        this.beOn = false;
        this.mineOn = false;

        if (!this.paperCenter) {
            center.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Drag items that you want to work on to this space.");
                })
            });
        };

        this.centerBounds = center.getBounds();

        // prevent crafting from starting until all items are collected
        if (!this.registry.get('allSchoolItemsCollected')) {
            glue.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            }) 
            be.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            }) 
            mine.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            }) 
            paper.on('pointerdown', () => {
                this.time.delayedCall(100, () => {
                    this.dialogue.show("Collect all items before you begin crafting!");
                })
            }) 
        }

        if (this.registry.get('paperCheck') === true && this.registry.get('friendTalk')) {
            if (this.registry.get('allSchoolItemsCollected')) {
                paper.setInteractive({ draggable: true });
                this.input.setDraggable(paper);
            }
            paper.setTexture('paper');

            paper.on('pointerover', () => {
                paper.setTexture('paper-select');
            });
            paper.on('pointerout', () => {
                paper.setTexture('paper');
            });

            // add drag events
            paper.on('dragstart', (pointer) => {
                paper.setTexture('paper-select');
            });

            paper.on('drag', (pointer, dragX, dragY) => {
                paper.x = dragX;
                paper.y = dragY;
            });

            paper.on('dragend', (pointer) => {
                const paperBounds = paper.getBounds();
                // check if the cat is overlapping with the center
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, paperBounds)) {
                    // snap to center
                    paper.x = center.x;
                    paper.y = center.y;
                    this.paperCenter = true;
                    paper.removeInteractive();
                } else {
                    // return to original position
                    paper.x = paperOgX;
                    paper.y = paperOgY;
                }
            });
        } else if (this.registry.get('paperCheck') === true && !this.registry.get('friendTalk')){
            this.time.delayedCall(100, () => {
                paper.setTexture('paper');
                this.dialogue.show("I should talk to my friends before crafting.");
            })    
        }

        if (this.registry.get('glueCheck') === true && this.registry.get('friendTalk')) {
            if (this.registry.get('allSchoolItemsCollected')) {
                glue.setInteractive({ draggable: true });
                this.input.setDraggable(glue);
            }
            glue.setTexture('glue');

            glue.on('pointerover', () => {
                glue.setTexture('glue-select');
            });
            glue.on('pointerout', () => {
                glue.setTexture('glue');
            });

            // add drag events
            glue.on('dragstart', (pointer) => {
                glue.setTexture('glue-select');
            });

            glue.on('drag', (pointer, dragX, dragY) => {
                glue.x = dragX;
                glue.y = dragY;
            });

            glue.on('dragend', (pointer) => {
                const glueBounds = glue.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, glueBounds) && this.paperCenter) {
                    this.glueSpots.setVisible(true);
                    glue.setVisible(false);
                    this.glueOn = true;
                } else {
                    // return to original position
                    glue.x = glueOgX;
                    glue.y = glueOgY;
                }
            });
        } else if (this.registry.get('glueCheck') === true && !this.registry.get('friendTalk')){
            this.time.delayedCall(100, () => {
                glue.setTexture('glue');
                this.dialogue.show("I should talk to my friends before crafting.");
            })
        }

        if (this.registry.get('beCheck') === true && this.registry.get('friendTalk')) {
            if (this.registry.get('allSchoolItemsCollected')) {
                be.setInteractive({ draggable: true });
                this.input.setDraggable(be);
            }
            be.setTexture('be');

            be.on('pointerover', () => {
                be.setTexture('be-select');
            });
            be.on('pointerout', () => {
                be.setTexture('be');
            });

            // add drag events
            be.on('dragstart', (pointer) => {
                be.setTexture('be-select');
            });

            be.on('drag', (pointer, dragX, dragY) => {
                be.x = dragX;
                be.y = dragY;
            });

            be.on('dragend', (pointer) => {
                const beBounds = be.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, beBounds) && this.glueOn) {
                    be.x = 230;
                    be.y = 90;
                    this.beOn = true;
                } else {
                    // return to original position
                    be.x = beOgX;
                    be.y = beOgY;
                }
            });
        } else if (this.registry.get('beCheck') === true && !this.registry.get('friendTalk')){
            this.time.delayedCall(100, () => {
                be.setTexture('be');
                this.dialogue.show("I should talk to my friends before crafting.");
            })
        }

        if (this.registry.get('mineCheck') === true && this.registry.get('friendTalk')) {
            if (this.registry.get('allSchoolItemsCollected')) {
                mine.setInteractive({ draggable: true });
                this.input.setDraggable(mine);
            }
            mine.setTexture('mine');

            mine.on('pointerover', () => {
                mine.setTexture('mine-select');
            });
            mine.on('pointerout', () => {
                mine.setTexture('mine');
            });

            // add drag events
            mine.on('dragstart', (pointer) => {
                mine.setTexture('mine-select');
            });

            mine.on('drag', (pointer, dragX, dragY) => {
                mine.x = dragX;
                mine.y = dragY;
            });

            mine.on('dragend', (pointer) => {
                const mineBounds = mine.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.centerBounds, mineBounds) && this.beOn) {
                    mine.x = 220;
                    mine.y = 170;
                    this.mineOn = true;

                    this.backButton.style.display = 'none';

                    this.time.delayedCall(200, () => {
                        this.dialogue.show("Yay! This looks perfect!");
                    });
                    this.time.delayedCall(2000, () => {
                        this.scene.launch('ItemScene', {
                            name: 'lettercreated'
                        });
                    });
                    this.time.delayedCall(4000, () => {
                        // destroy dialogue object and clean up DOM
                        this.dialogue.destroy();
                        const gameContainer = document.querySelector('canvas').parentElement;
                        while (gameContainer.firstChild) {
                            if (gameContainer.firstChild.tagName !== 'CANVAS') {
                                gameContainer.removeChild(gameContainer.firstChild);
                            } else {
                                gameContainer.appendChild(gameContainer.firstChild);
                                break;
                            }
                        }
                        
                        this.scene.start('DressUpScene');
                    })
                } else {
                    // return to original position
                    mine.x = mineOgX;
                    mine.y = mineOgY;
                }
            });
        } else if (this.registry.get('mineCheck') === true && !this.registry.get('friendTalk')){
            this.time.delayedCall(100, () => {
                mine.setTexture('mine');
                this.dialogue.show("I should talk to my friends before crafting.");
            })
        }

        //dialogue handler

        this.dialogue = new DialogueBox(this, 150, 256, 'lucy-talk');

        this.input.on('pointerdown', (pointer) => {
            if (this.dialogue.bg.visible) {
                this.dialogue.skipOrHide();
            }
        });

        // add event listeners for scene cleanups
        this.events.on('shutdown', this.cleanup, this);
        this.events.on('destroy', this.cleanup, this);
    }

    cleanup() {
        if (this.backButton && this.backButton.parentElement) {
            this.backButton.parentElement.removeChild(this.backButton);
        }
    }

    shutdown() {
        this.cleanup();
    }
}