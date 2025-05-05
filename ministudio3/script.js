const config = {
    type: Phaser.AUTO,
    width: 440,
    height: 224,
    pixelArt: true,
    physics: {
        default: 'matter',
        matter: {
            gravity: {y: 0.7},
            debug: false,
            showStaticBody: true,
            showCollisions: true
        }
    },
    scene: {
        preload,
        create,
        update
    },
    parent: 'phaser-game'
    
};

// start game
const  game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', 'assets/tileset/tileset.png');
    this.load.image('background0', 'assets/tileset/background_0.png')
    this.load.tilemapTiledJSON('map', 'assets/spooky-tileset.tmj');

    // load player sprite
    this.load.image('idle1', 'assets/sprites/player/idle-1.PNG');
    this.load.image('idle2', 'assets/sprites/player/idle-2.PNG');
    this.load.image('left1', 'assets/sprites/player/left-1.PNG');
    this.load.image('left2', 'assets/sprites/player/left-2.PNG');
    this.load.image('right1', 'assets/sprites/player/right-1.PNG');
    this.load.image('right2', 'assets/sprites/player/right-2.PNG');
    this.load.image('jump1', 'assets/sprites/player/jump-1.PNG');
    this.load.image('jump2', 'assets/sprites/player/jump-2.PNG');
}
  
function create() {
    // create animations
    this.anims.create({
        key: 'idle',
        frames: [
            {key: 'idle1'},
            {key: 'idle2'}
        ],
        frameRate: 4,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: [
            {key: 'right1'},
            {key: 'right2'}
        ],
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: [
            {key: 'left1'},
            {key: 'left2'}
        ],
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: [
            {key: 'jump2'}
        ],
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'land',
        frames: [
            {key: 'jump1'}
        ],
        frameRate: 1,
        repeat: 0
    });

       // Load map
       const map = this.make.tilemap({ key: 'map' });

       const mapWidth = map.widthInPixels;
       const mapHeight = map.heightInPixels;

       // set world bounds
       this.matter.world.setBounds(0, 0, mapWidth, mapHeight)

       const tileset = map.addTilesetImage('spooky_tileset', 'tiles');
       const bg = map.addTilesetImage('background-0', 'background0');
   
       // Create layers
       const background = map.createLayer('background', bg, 0, 0);
       const ground = map.createLayer('ground', tileset, 0, 0);
       const rocks = map.createLayer('rocks', tileset, 0, 0);
        map.createLayer('decoration', tileset, 0, 0);
       const platforms = map.createLayer('platforms', tileset, 0, 0);
       const trees = map.createLayer('trees', tileset, 0, 0);

       // platform collision
       ground.setCollisionByProperty({collides: true});
       this.matter.world.convertTilemapLayer(ground, {
            collisionOptions: {
                isStatic: true,
                label: 'ground'
            }
       });

       // custom collision shapes
       [rocks, trees, platforms].forEach(layer => {
        layer.setCollisionByProperty({ collides: true });

            this.matter.world.convertTilemapLayer(layer, {
                parseFromObject: false,
                collisionOptions: {
                    isStatic: true,
                    label: layer.layer.name,
                }
            });
        });
   
       // create ground detector
       const Bodies = this.matter.bodies; 
       const Body = this.matter.body;
       
       const mainBody = Bodies.rectangle(
           0, 
           0, 
           26, 
           34,
       );
       
       const groundSensor = Bodies.rectangle(
           0,
           18, 
           26,
           4, 
           { 
               isSensor: true,
               label: 'groundSensor',
               render: { visible: true } 
           }
       );
       
       const compoundBody = Body.create({
           parts: [mainBody, groundSensor],
           chamfer: { radius: 3 },
           friction: 0.05,
           frictionStatic: 0,
           frictionAir: 0.02,
           restitution: 0.0,
           label: 'player'
       });
    
        // create player with compound body
        this.matter.body.setPosition(compoundBody, {x: 70, y: 100});
        this.player = this.matter.add.sprite(0, 0, 'idle1');
        this.player.setExistingBody(compoundBody);
        this.player.setFixedRotation();
        this.player.setOrigin(0.5, 0.55);
        this.player.setIgnoreGravity(false);
        this.player.setFrictionAir(0.001);

        this.matter.world.on('collisionactive', (event) => {
            event.pairs.forEach(pair => {
                const bodies = [pair.bodyA, pair.bodyB];
                const isSensorContact = bodies.some(b => b.label === 'groundSensor');
                const isStaticContact = bodies.some(b => b.isStatic);

                if (isSensorContact && isStaticContact) {
                    this.isTouchingGround = true;
                }
            })
        });

        this.matter.world.on('collisionend', (event) => {
            event.pairs.forEach(pair => {
                const bodies = [pair.bodyA, pair.bodyB];
                const wasSensorContact = bodies.some(b => b.label === 'groundSensor');
                const wasStaticContact = bodies.some(b => b.isStatic);
                
                if (wasSensorContact && wasStaticContact) {
                    this.isTouchingGround = false;
                }
            });
        });

        // take keyboard inputs
        this.cursors = this.input.keyboard.createCursorKeys();

        // set up camera and bounds
       this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
       this.cameras.main.startFollow(this.player);

       // for jump logic
       this.landingCooldown = 0;
       this.wasInAir = false;

}
  

function update() {
    const speed = 3;
    const jumpForce = -6;
    const currentAnimation = this.player.anims.getName();

    // handle jump input first
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.isTouchingGround) {
        this.player.setVelocityY(jumpForce);
        this.player.play('jump', true);
        this.isTouchingGround = false;
        this.wasInAir = true;
        return;
    }

    // handle landing 
    if (this.wasInAir && this.isTouchingGround) {
        this.player.play('land', true);
        this.landingCooldown = this.time.now + 300;
        this.wasInAir = false;
    }

    // during landing cooldown
    if (this.time.now < this.landingCooldown) {
        return;
    }

    // airborne logic
    if (!this.isTouchingGround) {
        if (currentAnimation !== 'jump' && Phaser.Input.Keyboard.JustDown(this.cursors.up))  {
            this.player.play('jump', true);
        }
        // air control
        if (this.cursors.left.isDown) {
            this.player.play('left', true);
            this.player.setVelocityX(-3);
        } else if (this.cursors.right.isDown) {
            this.player.play('right', true);
            this.player.setVelocityX(3);
        }
        return;
    }

    // ground movement
    if (this.cursors.left.isDown) {
        this.player.play('left', true);
        this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
        this.player.play('right', true);
        this.player.setVelocityX(speed);
    } else {
        this.player.play('idle', true);
        this.player.setVelocityX(0);
    }

}