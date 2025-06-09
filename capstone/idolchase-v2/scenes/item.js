export default class ItemScene extends Phaser.Scene{
    constructor() {
        super('ItemScene');
    }

    init(data) {
        this.itemData = data;
    }
    
    preload() {
        this.load.image('catFound', './assets/items/catfound.png');
        this.load.image('boxFound', './assets/items/boxfound.png');
        this.load.image('buttonfound', './assets/items/buttonfound.png');
        this.load.image('clothfound', './assets/items/clothfound.png');
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
            if (this.card && this.card.parentElement) {
                this.card.parentElement.removeChild(this.card);
            }
            if (this.closeButton && this.closeButton.parentElement) {
                this.closeButton.parentElement.removeChild(this.closeButton);
            }
            // Emit event before stopping scene
            this.events.emit('itemClosed');
            // stop the scene
            this.scene.stop();
        };

        const cardWidth = 125;
        const cardHeight = 190;
        const cardX = (this.cameras.main.width - cardWidth) / 2;
        const cardY = (this.cameras.main.height - cardHeight) / 2;

        // dom for image
        this.card = document.createElement('img');
        this.card.id = 'item-card';
        this.card.src = `./assets/items/${this.itemData.name}.png`;
        
        // Add elements to DOM
        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.card);
            gameContainer.appendChild(this.closeButton);
        }
    }

    shutdown() {
        // clean up dom elements
        if (this.card && this.card.parentElement) {
            this.card.parentElement.removeChild(this.card);
        }
        if (this.closeButton && this.closeButton.parentElement) {
            this.closeButton.parentElement.removeChild(this.closeButton);
        }
        // remove overlay
        if (this.overlay) {
            this.overlay.destroy();
        }
    }
}