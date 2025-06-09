export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super('InventoryScene');
    }

    preload() {
        this.load.image('catFound', './assets/items/catfound.png');
        this.load.image('boxFound', './assets/items/boxfound.png');
        this.load.image('buttonfound', './assets/items/buttonfound.png');
        this.load.image('clothfound', './assets/items/clothfound.png');

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

        if (!this.registry.get('giftCreated')) {
            if (this.registry.get('catCheck')) {
                this.cat = document.createElement('img');
                this.cat.src = './assets/items/catfound.png';
                this.section.appendChild(this.cat);
            }
    
            if (this.registry.get('boxCheck')) {
                this.box = document.createElement('img');
                this.box.src = './assets/items/boxfound.png';
                this.section.append(this.box);
            }
    
            if (this.registry.get('clothCheck')) {
                this.cloth = document.createElement('img');
                this.cloth.src = './assets/items/clothfound.png';
                this.section.appendChild(this.cloth);
            }
    
    
            if (this.registry.get('buttonCheck')) {
                this.button = document.createElement('img');
                this.button.src = './assets/items/buttonfound.png';
                this.section.append(this.button);
            }
        }
        
        if (this.registry.get('giftCreated')) {
            this.gift = document.createElement('img');
            this.gift.src = './assets/items/giftcreated.png';
            this.section.append(this.gift);
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