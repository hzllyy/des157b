export default class DialogueBox {
    constructor(scene, x, y, bgKey, width = 150, height = 100, padding = 20) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // create bg 
        this.bg = scene.add.image(x, y, bgKey).setOrigin(0.5, 1).setVisible(false);

        // phaser text object inside
        this.text = scene.add.bitmapText(250, 30, 'dogica', 'ALL SET', 6);

        this.isTyping = false;
        this.typingSpeed = 30;
    }

    // fuunction for showing dialogue
    show(text, onComplete) {
        this.bg.setVisible(true);
        this.text.setVisible(true);
        this.typeText(text, onComplete);
    }

    // func for hiding dialogue
    hide() {
        this.bg.setVisible(false);
        this.text.setVisible(false);
        this.isTyping.false;
    }

    // type text
    typeText(fullText, onComplete) {
        // prevent overlap
        if (this.isTyping) return;

        this.isTyping = true;
        this.text.setText('');
        let i = 0;

        this.scene.time.addEvent({
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
}