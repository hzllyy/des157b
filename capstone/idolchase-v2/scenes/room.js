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
        this.load.image('doll', 'assets/room/doll.PNG');
        this.load.image('door', 'assets/room/door1.PNG');
        this.load.image('posters', 'assets/room/posters.PNG');
        this.load.image('vanity', 'assets/room/vanity.PNG');

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
        this.items.push({
            sprite: this.add.image(405, 131, 'doll').setInteractive({useHandCursor: true}),
            x: 405
        });

        this.items.push({
            sprite: this.add.image(390, 70, 'posters').setInteractive({useHandCursor: true}),
            x: 390
        });

        this.items.push({
            sprite: this.add.image(388, 181, 'box').setInteractive({useHandCursor: true}),
            x: 388
        });

        this.items.push({
            sprite: this.add.image(600, 138, 'vanity').setInteractive({useHandCursor: true}),
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

        this.items.push({
            sprite: this.add.image(845, 157, 'desk').setInteractive({useHandCursor: true}),
            x: 845
        });

        this.items.push({
            sprite: this.add.image(1030, 123, 'coat').setInteractive({useHandCursor: true}),
            x: 1030
        });

        const door2 = this.add.image(1105, 113, 'door').setInteractive({useHandCursor: true});
        door2.on('pointerdown', () => {
            this.scene.start('ClassroomScene');
        });
        this.items.push({
            sprite: door2,
            x: 1105
        });

        this.items.push({
            sprite: this.add.image(1030, 123, 'coat').setInteractive({useHandCursor: true}),
            x: 1030
        });

        // load lucy
        this.lucy = this.add.sprite(224, 215, 'lucy-idle-1')
            .setOrigin(0.5, 1)
            .play('lucy-idle');

        // read cursor input
        this.cursors = this.input.keyboard.createCursorKeys();
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