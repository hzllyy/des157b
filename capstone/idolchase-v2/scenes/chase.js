import Slides from '../ui/slides.js';

export default class ChaseScene extends Phaser.Scene{
    constructor() {
        super('ChaseScene');
    }

    preload() {
        // load background
        this.load.image('bgchase', 'assets/chase/background.PNG');

        // load scrolling assets
        this.load.image('crowd', 'assets/chase/crowd.PNG');
        this.load.image('floor', 'assets/chase/floor.PNG');

        // load lucy images
        this.load.image('lucy-run-1', 'assets/chase/lucy-run-1.PNG');
        this.load.image('lucy-run-2', 'assets/chase/lucy-run-2.PNG');
        this.load.image('lucy-jump', 'assets/chase/lucy-jump.PNG');

        // load idol images
        this.load.image('idol-run-1', 'assets/chase/idol-run-1.PNG');
        this.load.image('idol-run-2', 'assets/chase/idol-run-2.PNG');
        this.load.image('idol-jump', 'assets/chase/idol-jump.PNG');

        // load obstacle img
        this.load.image('gift-pink', 'assets/chase/gift-pink.PNG');
        this.load.image('gift-purple', 'assets/chase/gift-purple.PNG');
        this.load.image('brown-bear', 'assets/chase/teddybear-brown.PNG');
        this.load.image('pink-bear', 'assets/chase/teddybear-pink.PNG');

        // load progress bar
        this.load.image('load-bar', 'assets/chase/load-bar.PNG');
        this.load.image('load', 'assets/chase/load.PNG');

        // load hearts
        this.load.image('life', 'assets/chase/life.PNG');
        this.load.image('life-lost', 'assets/chase/life-loss.PNG');

        // load icons
        this.load.image('icon-far', 'assets/chase/icon-far.PNG');
        this.load.image('icon-medium', 'assets/chase/icon-medium.PNG');
        this.load.image('icon-short', 'assets/chase/icon-short.PNG');
    }

    create() {
        // lucy anims
        this.anims.create({
            key: 'lucy-run',
            frames: [
                {key: 'lucy-run-1'},
                {key: 'lucy-run-2'}
            ],
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'lucy-jump',
            frames: [
                {key: 'lucy-jump'}
            ],
            frameRate: 1,
            repeat: 0
        });

        // idol anims
        this.anims.create({
            key: 'idol-run',
            frames: [
                {key: 'idol-run-1'},
                {key: 'idol-run-2'}
            ],
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'idol-jump',
            frames: [
                {key: 'idol-jump'}
            ],
            frameRate: 1,
            repeat: 0
        });

        // draw bg
        this.add.image(0, 0, 'bgchase').setOrigin(0, 0);

        // get widths
        const crowdWidth = this.textures.get('crowd').getSourceImage().width;
        const floorWidth = this.textures.get('floor').getSourceImage().width;
        const canvasWidth = this.sys.game.config.width;

        // scrolling floor
        this.floorSpeed = 3.75;
        this.floors = [];
        this.totalDistance = 0;
        this.lastUpdateTime = 0;

        // scrolling crowd
        this.crowdSpeed = 3.75;
        this.crowdImages = [];
        
        for (let i = 0; i < Math.ceil(this.sys.game.config.width / crowdWidth) + 2; i++) {
            const crowd = this.add.image(i * crowdWidth, 80, 'crowd').setOrigin(0, 0);
            this.crowdImages.push(crowd);
        }

        for (let i = 0; i < Math.ceil(canvasWidth / floorWidth) + 2; i++) {
            const floor = this.add.image(i * floorWidth, 183, 'floor').setOrigin(0, 0);
            this.floors.push(floor);
        }
        this.floorOffsets = this.floors.map(f => f.x);
        
        // load idol
        this.idol = this.physics.add.sprite(230, 190, 'idol-run-1').play('idol-run').setOrigin(0.5, 1);
        this.idol.body.debugShowBody = false;
        this.idol.body.debugShowVelocity = false;

        // load lucy 
        this.lucy = this.physics.add.sprite(70, 190, 'lucy-run-1').play('lucy-run').setOrigin(0.5, 1);
        this.lucy.body.debugShowBody = false;
        this.lucy.body.debugShowVelocity = false;

        // load lives
        this.heart1 = this.add.image(377, 20, 'life');
        this.heart2 = this.add.image(395, 20, 'life');
        this.heart3 = this.add.image(412, 20, 'life');

        // load bar
        this.loadbar = this.add.image(224, 20, 'load-bar');
        this.load = this.add.image(105, 20, 'load').setOrigin(0, 0.5);
        this.load.setScale(0.24, 1);

        // load icons
        this.icon = this.add.image(190, 20, 'icon-far').setOrigin(1, 0.5);

        // load slides
        this.slide = new Slides(this, 224, 156);

        // setup timer
        this.timeLeft = 60;
        this.timerText = this.add.text(32, 8, '1:00', { 
            fontSize: '24px', 
            fill: '#849DC0',
            fontFamily: 'VT323'
        });

        // setup game state
        this.isGameStarted = true;
        this.pauseGame();

        // jump logic
        this.isJumping = false;
        this.jumpVelocity = -9;
        this.gravity = 0.42;
        this.idolVelocityY = 0;
        this.groundY = 190;

        // lucy bot jump logic
        this.lucyIsJumping = false;
        this.lucyVelocityY = 0;
        this.lucyJumpVelocity = -9;

        // obstacle group
        this.obstacleGroup = this.add.group();
        this.obstacleSpacing = Phaser.Math.Between(150, 350);
        this.distanceSinceLastObstacle = 0; 
        this.obstacleTypes = ['gift-pink', 'gift-purple', 'brown-bear', 'pink-bear'];
        this.obstacleSpawnDistances = new Map();
        this.hasSpawnedFirstObstacle = false;

        // deal with collides
        this.physics.add.collider(this.idol, this.obstacleGroup, this.handleCollision, null, this);
        this.notHit = true;
        this.collisionHandled = false;

        // keep track of number of lives
        this.idolLives = 3;

        // ground collision
        this.idol.setCollideWorldBounds(true);
        this.idol.body.setAllowGravity(false);

        this.lucy.setCollideWorldBounds(true);
        this.lucy.body.setAllowGravity(false);

        // read cursor input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    pauseGame() {
        this.floorSpeed = 0;
        this.crowdSpeed = 0;
        this.idol.stop();
        this.lucy.stop();
        this.isGameStarted = false;
    }

    startGame() {
        this.floorSpeed = 3.75;
        this.crowdSpeed = 3.75;
        this.idol.play('idol-run', true);
        this.lucy.play('lucy-run', true);
        this.isGameStarted = true;

        // start timer
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // delay first obstacle spawn
        this.time.delayedCall(2000, () => {
            this.spawnObstacle();
            this.hasSpawnedFirstObstacle = true;
            this.distanceSinceLastObstacle = 0;
            this.obstacleSpacing = Phaser.Math.Between(150, 350);
        });
    }

    updateTimer() {
        this.timeLeft--;
        
        // calculate time
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        // format time
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.timerText.setText(timeString);

        // move icon right and increase load bar width
        this.icon.x += 2.7;
        this.load.scaleX += 0.013; 

        // check if time is up
        if (this.timeLeft <= 0) {
            this.scene.pause();
        }
    }

    update(time, delta) {
        
        if (!this.isGameStarted) return;

        const crowdWidth = this.textures.get('crowd').getSourceImage().width;
        const floorWidth = this.textures.get('floor').getSourceImage().width;

        // calc exact movement based on time
        const timeDiff = time - this.lastUpdateTime;
        const movement = (this.floorSpeed * timeDiff) / 16.67;
        this.totalDistance += movement;
        this.lastUpdateTime = time;

        // move floor with exact movement
        this.floorOffsets = this.floorOffsets.map(offset => offset - movement);

        this.floors.forEach((floor, i) => {
            let offset = this.floorOffsets[i];
        
            if (offset <= -floorWidth) {
                offset += floorWidth * this.floors.length;
            }
        
            this.floorOffsets[i] = offset;
            floor.x = Math.round(offset); 
        });

        this.crowdImages.forEach(crowd => {
            crowd.x -= movement;
            if (crowd.x <= -crowdWidth) {
                crowd.x += crowdWidth * this.crowdImages.length;
            }
        });

        // jump logic
        if (this.cursors.up.isDown && !this.isJumping ||
            this.cursors.space .isDown && !this.isJumping
        ) {
            this.isJumping = true;
            this.idolVelocityY = this.jumpVelocity;
            this.idol.play('idol-jump', true);
        }

        const deltaFactor = delta / 16.67;

        // idol vertical movement
        if (this.isJumping) {
            this.idol.y += this.idolVelocityY * deltaFactor;
            this.idolVelocityY += this.gravity * deltaFactor;
        
            //landing
            if (this.idol.y >= this.groundY) {
                this.idol.y = this.groundY;
                this.isJumping = false;
                this.idol.play('idol-run', true);
            }
        }

        // lucy bot jump logic
        if (!this.lucyIsJumping) {
            // check obstacle distance
            const upcomingObstacle = this.obstacleGroup.getChildren().find(obstacle => {
                return obstacle.x > this.lucy.x && obstacle.x - this.lucy.x < 40;
            });

            if (upcomingObstacle && this.notHit) {
                this.lucyIsJumping = true;
                this.lucyVelocityY = this.lucyJumpVelocity;
                this.lucy.play('lucy-jump', true);
            }
        }

        if (this.lucyIsJumping) {
            this.lucy.y += this.lucyVelocityY * deltaFactor;
            this.lucyVelocityY += this.gravity * deltaFactor;
        
            if (this.lucy.y >= this.groundY) {
                this.lucy.y = this.groundY;
                this.lucyIsJumping = false;
                this.lucy.play('lucy-run', true);
            }
        }

        // scroll distance update
        this.distanceSinceLastObstacle += movement;

        // spawn obstacle every few px, but only after first obstacle has spawned
        if (this.hasSpawnedFirstObstacle && this.distanceSinceLastObstacle >= this.obstacleSpacing) {
            this.spawnObstacle();
            this.distanceSinceLastObstacle = 0;
            this.obstacleSpacing = Phaser.Math.Between(150, 350);
        }

        // update obstacle positions based on total distance
        this.obstacleGroup.getChildren().forEach(obstacle => {
            const spawnDistance = this.obstacleSpawnDistances.get(obstacle);
            const distanceTraveled = this.totalDistance - spawnDistance;
            
            // calculate pos
            obstacle.x = Math.round(this.sys.game.config.width - distanceTraveled);
        
            // remove obstacle once offscreen
            if (obstacle.x + obstacle.width < 0) {
                this.obstacleSpawnDistances.delete(obstacle);
                this.obstacleGroup.remove(obstacle, true, true);
            }
        }); 

        this.obstacleGroup.getChildren().forEach(obstacle => {
            if (!this.obstacleSpawnDistances.has(obstacle)) return;
        
            const spawnDistance = this.obstacleSpawnDistances.get(obstacle);
            const distanceTraveled = this.totalDistance - spawnDistance;
        
            obstacle.x = Math.round(this.sys.game.config.width - distanceTraveled);
        
            if (obstacle.x + obstacle.width < 0) {
                this.obstacleSpawnDistances.delete(obstacle);
                this.obstacleGroup.remove(obstacle, true, true);
            }
        });
    }

    spawnObstacle() {
        const type = Phaser.Utils.Array.GetRandom(this.obstacleTypes);
        const obstacle = this.physics.add.image(this.sys.game.config.width, 190, type)
            .setOrigin(0, 1)
            .setDepth(1)
            .setImmovable(true);

        obstacle.body.setAllowGravity(false);
        obstacle.body.debugShowBody = false;
        obstacle.body.debugShowVelocity = false;

        this.obstacleGroup.add(obstacle);
        this.obstacleSpawnDistances.set(obstacle, this.totalDistance);
    } 

    // collision method
    handleCollision(idol, obstacle) {
        // one collision at a time
        if (this.collisionHandled) return;
        console.log('collision detected');

        // store current time left before pausing
        this.storedTimeLeft = this.timeLeft;

        // freeze lucy
        this.lucy.stop();
        this.lucyIsJumping = false;
        this.lucyVelocityY = 0; 
        this.notHit = false;

        // freeze the idol
        this.idol.stop();
        this.isJumping = false;
        this.idolVelocityY = 0;

        // freeze scene
        this.floorSpeed = 0;
        this.crowdSpeed = 0;

        this.collisionHandled = true;

        // keep track of lives
        this.idolLives--; 
        
        this.idolHurt();
    }

    // heart reset
    heartReset() {
        if (this.idolLives == 2) {
            this.heart3.setTexture('life-lost');
        } else if (this.idolLives == 1) {
            this.heart2.setTexture('life-lost');
        } else if (this.idolLives == 0) {
            this.heart1.setTexture('life-lost');
        }
    }

    // icon reset and lucy position reset
    iconReset() {
        if (this.idolLives == 2) {
            this.icon.setTexture('icon-medium');
            this.lucy.x = 110;
        } else if (this.idolLives == 1) {
            this.icon.setTexture('icon-short');
            this.lucy.x = 160;
        }
    }

    // method for hit idol
    idolHurt() {
        // clear any existing timers
        this.time.removeAllEvents();

        // create three flashes
        this.time.delayedCall(100, () => {
            // 1st flash
            this.idol.setVisible(false);
            this.time.delayedCall(500, () => {
                this.idol.setVisible(true);
                
                // second flash
                this.time.delayedCall(100, () => {
                    this.idol.setVisible(false);
                    this.time.delayedCall(500, () => {
                        this.idol.setVisible(true);
                        
                        // third flash
                        this.time.delayedCall(100, () => {
                            this.idol.setVisible(false);
                            this.time.delayedCall(500, () => {
                                this.idol.setVisible(true);

                                // check lives
                                if (this.idolLives <= 0) {
                                    this.heartReset();
                                    this.scene.pause();
                                    return;
                                }

                                // reset hearts and icons
                                this.heartReset();
                                this.iconReset();

                                // resume the game
                                this.floorSpeed = 3.75;
                                this.crowdSpeed = 3.75;
                                
                                // reset positions to ground
                                this.idol.y = this.groundY;
                                this.lucy.y = this.groundY;
                                
                                // start running anims
                                this.idol.play('idol-run', true);
                                this.lucy.play('lucy-run', true);
                                this.collisionHandled = false;
                                this.notHit = true;
                                
                                // clear all obstacles
                                this.obstacleGroup.clear(true, true);
                                this.obstacleSpawnDistances.clear();
                                this.distanceSinceLastObstacle = 0;
                                this.obstacleSpacing = Phaser.Math.Between(150, 350);
                                this.hasSpawnedFirstObstacle = false;

                                // resume timer from stored time
                                this.timeLeft = this.storedTimeLeft;
                                const minutes = Math.floor(this.timeLeft / 60);
                                const seconds = this.timeLeft % 60;
                                this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                                this.time.addEvent({
                                    delay: 1000,
                                    callback: this.updateTimer,
                                    callbackScope: this,
                                    loop: true
                                });
                                
                                // spawn new obstacles
                                this.time.delayedCall(2000, () => {
                                    this.spawnObstacle();
                                    this.hasSpawnedFirstObstacle = true;
                                    this.distanceSinceLastObstacle = 0;
                                    this.obstacleSpacing = Phaser.Math.Between(150, 350);
                                });
                            });
                        });
                    });
                });
            });
        });
    }
        
}