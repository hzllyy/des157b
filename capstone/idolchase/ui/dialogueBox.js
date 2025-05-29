export default class DialogueBox {
    constructor(scene, x, y, bgKey, width = 130, height = 100, padding = 20) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.fullText = '';
        this.onComplete = null;
        this.currentEvent = null;

        // create bg 
        this.bg = scene.add.image(250, 256, bgKey).setOrigin(0.5, 1).setVisible(false);

        this.text = scene.add.bitmapText(230, 220, 'dogica', '', 6).setMaxWidth(width);

        this.isTyping = false;
        this.typingSpeed = 30;
    }

    // fuunction for showing dialogue
    show(text, onComplete, newBgKey = null) {
        if (newBgKey) {
            this.bg.setTexture(newBgKey);
        }

        this.bg.setVisible(true);
        this.text.setVisible(true);
        this.typeText(text, onComplete);
    }

    // func for hiding dialogue
    hide() {
        this.bg.setVisible(false);
        this.text.setVisible(false);
        this.isTyping = false;
    };


    // type text
    typeText(fullText, onComplete) {
        // prevent overlap
        if (this.isTyping) return;

        this.fullText = fullText;
        this.onComplete = onComplete;
        this.text.setText('');
        this.isTyping = true;

        let i = 0;

        this.currentEvent = this.scene.time.addEvent({
            delay: this.typingSpeed,
            callback: () => {
                this.text.text += fullText[i];
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
            this.text.setText(this.fullText);
            this.isTyping = false;

            if (this.onComplete) this.onComplete();
        } else {
            this.hide();
        }
    };
}