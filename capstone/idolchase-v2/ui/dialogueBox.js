export default class DialogueBox extends Phaser.Events.EventEmitter {
    constructor(scene, x, y, bgKey) {
        super();
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.fullText = '';
        this.onComplete = null;
        this.currentEvent = null;
        this.typingSpeed = 30;
        this.isTyping = false;

        // create bg 
        this.bg = scene.add.image(230, 256, bgKey).setOrigin(0.5, 1).setVisible(false);

        // dom styling
        this.textElement = document.createElement('div');
        this.textElement.id = 'dialogue-box';

        // append to game
        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        console.log(canvas);
        console.log(gameContainer);
        if (gameContainer) {
            gameContainer.appendChild(this.textElement);
        }

        // listen for scene sleep/wake events
        this.scene.events.on('sleep', () => {
            this.textElement.style.display = 'none';
            this.textElement.textContent = '';
            if (this.currentEvent) {
                this.currentEvent.remove(false);
            }
        });

        this.scene.events.on('wake', () => {
            this.textElement.style.display = 'none';
            this.textElement.textContent = '';
        });
    }

    // fuunction for showing dialogue
    show(text, onComplete, newBgKey = null) {
        if (newBgKey) {
            this.bg.setTexture(newBgKey);
        }

        this.bg.setVisible(true);
        this.textElement.style.display = 'block';
        
        this.typeText(text, onComplete);
    }

    // func for hiding dialogue
    hide() {
        this.bg.setVisible(false);
        this.textElement.style.display = 'none';
        this.isTyping = false;
    };

    // type text
    typeText(fullText, onComplete) {
        // prevent overlap
        if (this.isTyping) return;

        this.fullText = fullText;
        this.onComplete = onComplete;
        this.textElement.textContent = '';
        this.isTyping = true;

        let i = 0;

        this.currentEvent = this.scene.time.addEvent({
            delay: this.typingSpeed,
            callback: () => {
                this.textElement.textContent += fullText[i];
                i++;
                if (i >= fullText.length) {
                    this.isTyping = false;
                    if (onComplete) onComplete();
                }
            },
            repeat: fullText.length - 1
        });
    }

    // func for skipping and hiding dialogue
    skipOrHide() {
        if (this.isTyping) {
            // finish typing immediately
            this.currentEvent.remove(false);

            // show full text
            this.textElement.textContent = this.fullText;
            this.isTyping = false;

            if (this.onComplete) this.onComplete();
        } else {
            this.hide();
        }
    };
}