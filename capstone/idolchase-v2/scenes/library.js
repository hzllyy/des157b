export default class LibraryScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'LibraryScene'
        });
    }

    preload() {
        this.load.image('bglibrary', 'assets/library/bglibrary.PNG');
        this.load.image('window', 'assets/classroom/window.PNG');
        this.load.image('bookshelf', 'assets/library/bookcase.PNG');
        this.load.image('libdoor', 'assets/hallway/classroomdoor.PNG');
    }

    create() {
        // Set library check to true when entering the scene
        this.registry.set('libraryCheck', true);

        this.bglib = this.add.image(0, 0, 'bglibrary').setOrigin(0,0);

        this.minX = -(this.bglib.width - this.sys.game.config.width);
        this.maxX = 0; 
        this.bglibX = this.minX;  // start from the left side
        this.bglib.x = this.bglibX;

        //items array
        this.itemshall = [];

        // add items to array
        this.libdoor = this.add.image(375, 120, 'libdoor').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.libdoor,
            x: 375
        });
        // this.libdoor.on('pointerdown', () => {
        //     this.scene.wake('HallwayScene');
        //     this.scene.sleep();
        // });
        this.libdoor.on('pointerdown', () => {
            this.scene.start('DressUpScene');
            this.scene.pause();
        });

        this.window1 = this.add.image(145, 80, 'window')
        this.itemshall.push({
            sprite: this.window1,
            x: 145
        });
        this.window2 = this.add.image(-160, 80, 'window')
        this.itemshall.push({
            sprite: this.window2,
            x: -160
        });
        this.window3 = this.add.image(-470, 80, 'window')
        this.itemshall.push({
            sprite: this.window3,
            x: -470
        });

        this.bookshelf1 = this.add.image(255, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf1,
            x: 255
        });
        this.bookshelf2 = this.add.image(45, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf2,
            x: 45
        });
        this.bookshelf3 = this.add.image(-50, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf3,
            x: -50
        });
        this.bookshelf4 = this.add.image(-270, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf4,
            x: -270
        });
        this.bookshelf6 = this.add.image(-355, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf6,
            x: -355
        });
        this.bookshelf7 = this.add.image(-575, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf7,
            x: -575
        });

        // load lucy
        this.lucy = this.add.sprite(224, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

        // read cursor input
        this.cursors = this.input.keyboard.createCursorKeys();

    }
    updateItemPosition(itemhall, direction) {
        const newX = itemhall.x + (direction * 1.5);
        itemhall.sprite.x = newX;
        itemhall.x = newX;
    }

    updateAllItems(direction) {
        for (const itemhall of this.itemshall) {
            this.updateItemPosition(itemhall, direction);
        }
    }
    
    update() {
        // check if movement keys are pressed
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDow

        if (this.cursors.left.isDown) {
            this.lucy.play('lucy-left', true);
            // Try to scroll bg
            const newBgLibX = Phaser.Math.Clamp(this.bglibX + 1.5, this.minX, this.maxX);

            // move items if bg is scrolling
            if (newBgLibX !== this.bglibX) {
                this.bglibX = newBgLibX;
                this.bglib.x = this.bglibX;
                this.updateAllItems(1);
            }
        } else if (this.cursors.right.isDown) {
            this.lucy.play('lucy-right', true);
            const newBgLibX = Phaser.Math.Clamp(this.bglibX - 1.5, this.minX, this.maxX);

            if (newBgLibX !== this.bglibX) {
                this.bglibX = newBgLibX;
                this.bglib.x = this.bglibX;
                this.updateAllItems(-1);
            }
        } else if (!isMoving) {
            this.lucy.play('lucy-idle', true);
        }

    }
}