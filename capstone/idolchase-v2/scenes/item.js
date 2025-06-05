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
            // sleep the scene
            this.scene.sleep();
        };

        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5)
        .setOrigin(0, 0);

        const cardWidth = 125;
        const cardHeight = 190;
        const cardX = (this.cameras.main.width - cardWidth) / 2;
        const cardY = (this.cameras.main.height - cardHeight) / 2;

        // dom for image
        this.card = document.createElement('img');
        this.card.id = 'item-card';
        this.card.src = `./assets/items/${this.itemData.name}.png`;
        
        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.card);
            gameContainer.appendChild(this.closeButton);
        }
    }

    shutdown() {
        console.log('Shutdown called');
    }
}