export default class WinScene extends Phaser.Scene {
    constructor() {
        super('WinScene');
    }

    preload() {
        this.load.image('you-win', 'assets/startend/you-win.PNG');
    }

    create() {
        this.add.image(0, 0, 'you-win').setOrigin(0, 0);

        this.backbtn = document.createElement('button');
        this.backbtn.textContent = 'BACK';
        this.backbtn.id = 'final-back';
        this.backbtn.onclick = () => {
            this.scene.start('OpenerClass');
        }
        this.playAgain = document.createElement('button');
        this.playAgain.textContent = 'REPLAY';
        this.playAgain.id = 'final-play';
        this.playAgain.onclick = () => {
            this.scene.start('ChaseScene');
        }

        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.backbtn);
            gameContainer.appendChild(this.playAgain);
        }

        this.events.on('shutdown', this.cleanup, this);

    }

    cleanup() {
        if (this.playAgain && this.playAgain.parentElement) {
            this.playAgain.parentElement.removeChild(this.playAgain);
        }
        if (this.backbtn && this.backbtn.parentElement) {
            this.backbtn.parentElement.removeChild(this.backbtn);
        }
    }

    shutdown() {
        this.cleanup();
    }
}