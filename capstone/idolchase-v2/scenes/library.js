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
        this.load.image('bookshelfselect', 'assets/library/bookcase-select.PNG');
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
        this.libdoor.on('pointerover', () => {
            this.libdoor.setTexture('classdoor');
        })
        this.libdoor.on('pointerout', () => {
            this.libdoor.setTexture('libdoor');
        })

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
        this.bookshelf1.on('pointerover', () => {
            this.bookshelf1.setTexture('bookshelfselect');
        });
        this.bookshelf1.on('pointerout', () => {
            this.bookshelf1.setTexture('bookshelf');
        });
        this.bookshelf2 = this.add.image(45, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf2,
            x: 45
        });
        this.bookshelf2.on('pointerover', () => {
            this.bookshelf2.setTexture('bookshelfselect');
        });
        this.bookshelf2.on('pointerout', () => {
            this.bookshelf2.setTexture('bookshelf');
        });
        this.bookshelf3 = this.add.image(-50, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf3,
            x: -50
        });
        this.bookshelf3.on('pointerover', () => {
            this.bookshelf3.setTexture('bookshelfselect');
        });
        this.bookshelf3.on('pointerout', () => {
            this.bookshelf3.setTexture('bookshelf');
        });
        this.bookshelf4 = this.add.image(-270, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf4,
            x: -270
        });
        this.bookshelf4.on('pointerover', () => {
            this.bookshelf4.setTexture('bookshelfselect');
        });
        this.bookshelf4.on('pointerout', () => {
            this.bookshelf4.setTexture('bookshelf');
        });
        this.bookshelf6 = this.add.image(-355, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf6,
            x: -355
        });
        this.bookshelf6.on('pointerover', () => {
            this.bookshelf6.setTexture('bookshelfselect');
        });
        this.bookshelf6.on('pointerout', () => {
            this.bookshelf6.setTexture('bookshelf');
        });
        this.bookshelf7 = this.add.image(-575, 110, 'bookshelf').setInteractive({useHandCursor: true});
        this.itemshall.push({
            sprite: this.bookshelf7,
            x: -575
        });
        this.bookshelf7.on('pointerover', () => {
            this.bookshelf7.setTexture('bookshelfselect');
        });
        this.bookshelf7.on('pointerout', () => {
            this.bookshelf7.setTexture('bookshelf');
        });

        // load lucy
        this.lucy = this.add.sprite(224, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

        // read cursor input
        this.cursors = this.input.keyboard.createCursorKeys();

    }
    updateItemPosition(itemlib, offset) {
        itemlib.x += offset;
        itemlib.sprite.x = itemlib.x;
    }

    updateAllItems(direction) {
        for (const itemhall of this.itemshall) {
            this.updateItemPosition(itemhall, direction);
        }
    }
    
    update(time, delta) {
        // check if movement keys are pressed
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDown;

        const scrollSpeed = 0.175 * delta;

        if (this.cursors.left.isDown) {
            this.lucy.play('lucy-left', true);
            // Try to scroll bg
            const newBgLibX = Phaser.Math.Clamp(this.bglibX + scrollSpeed, this.minX, this.maxX);

            // move items if bg is scrolling
            if (newBgLibX !== this.bglibX) {
                this.bglibX = newBgLibX;
                this.bglib.x = this.bglibX;
                this.updateAllItems(scrollSpeed);
            }
        } else if (this.cursors.right.isDown) {
            this.lucy.play('lucy-right', true);
            const newBgLibX = Phaser.Math.Clamp(this.bglibX - scrollSpeed, this.minX, this.maxX);

            if (newBgLibX !== this.bglibX) {
                this.bglibX = newBgLibX;
                this.bglib.x = this.bglibX;
                this.updateAllItems(-scrollSpeed);
            }
        } else if (!isMoving) {
            this.lucy.play('lucy-idle', true);
        }

    }
}