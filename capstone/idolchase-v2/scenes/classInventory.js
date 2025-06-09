export default class ClassInventory extends Phaser.Scene {
    constructor() {
        super('ClassInventory');
    }

    preload() {
        this.load.image('gluefound', 'assets/items/gluefound.png');
        this.load.image('minefound', 'assets/items/minefound.png');
        this.load.image('paperfound', 'assets/items/paperfound.png');
        this.load.image('befound', 'assets/items/befound.png');
    }

    create() {
         // ensure scene is ready
         this.scene.bringToTop();

         // create overlay first
         this.overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5)
             .setOrigin(0, 0)
             .setDepth(0)
             .setScrollFactor(0);
 
         // create and add back button
        this.closeButton = document.createElement('button');
        this.closeButton.id = 'item-close-btn';
        this.closeButton.textContent = 'CLOSE';
        this.closeButton.onclick = () => {
            // remove elements
            if (this.section && this.section.parentElement) {
                this.section.parentElement.removeChild(this.section);
            }
            if (this.closeButton && this.closeButton.parentElement) {
                this.closeButton.parentElement.removeChild(this.closeButton);
            }
            // stop the scene
            this.scene.stop();
        };
        
        this.section = document.createElement('div');
        this.section.id = 'section';

        if (this.registry.get('glueCheck')) {
            this.glue = document.createElement('img');
            this.glue.src = './assets/items/gluefound.png';
            this.section.append(this.glue);
        }

        if (this.registry.get('paperCheck')) {
            this.paper = document.createElement('img');
            this.paper.src = './assets/items/paperfound.png';
            this.section.appendChild(this.paper);
        }

        if (this.registry.get('beCheck')) {
            this.be = document.createElement('img');
            this.be.src = './assets/items/befound.png';
            this.section.appendChild(this.be);
        }


        if (this.registry.get('mineCheck')) {
            this.mine = document.createElement('img');
            this.mine.src = './assets/items/minefound.png';
            this.section.append(this.mine);
        }

        // add elements to DOM
        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.closeButton);
            gameContainer.appendChild(this.section);
        }

        this.events.on('shutdown', this.cleanup, this);
    }

    cleanup() {
        if (this.section && this.section.parentElement) {
            this.section.parentElement.removeChild(this.section);
        }
        if (this.closeButton && this.closeButton.parentElement) {
            this.closeButton.parentElement.removeChild(this.closeButton);
        }
    }

    shutdown() {
        this.cleanup();
        // remove overlay
        if (this.overlay) {
            this.overlay.destroy();
        }
    }
}