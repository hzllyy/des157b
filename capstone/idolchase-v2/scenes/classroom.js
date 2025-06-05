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
        } )

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
}