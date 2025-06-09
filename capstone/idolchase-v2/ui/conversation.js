export default class Conversation {
    constructor(scene) {
        this.scene = scene;
        this.dialogueBox = null;
        this.conversationQueue = [];
        this.isInConversation = false;
    }

    // initialize with dialogueBox
    setDialogueBox(dialogueBox) {
        this.dialogueBox = dialogueBox;
    }

    // add dialogue to queue
    addDialogue(text, bgKey = null) {
        this.conversationQueue.push({ text, bgKey });
    }

    // begin convo
    start() {
        if (this.isInConversation || this.conversationQueue.length === 0) return;
        
        this.isInConversation = true;
        this.showNextDialogue();
    }

    // show next dialogue
    showNextDialogue() {
        if (this.conversationQueue.length === 0) {
            this.isInConversation = false;
            // Emit event when conversation is complete
            this.dialogueBox.emit('conversationComplete');
            return;
        }

        const { text, bgKey } = this.conversationQueue.shift();
        
        // show dialogue and set up the next one when complete
        this.dialogueBox.show(text, () => {
            // When typing is complete, wait for user click to continue
            this.scene.input.once('pointerdown', () => {
                // If there's more dialogue, show it
                if (this.conversationQueue.length > 0) {
                    this.showNextDialogue();
                } else {
                    // If this was the last dialogue, hide the box
                    this.dialogueBox.hide();
                    this.isInConversation = false;
                    // Emit event when conversation is complete
                    this.dialogueBox.emit('conversationComplete');
                }
            });
        }, bgKey);

        // Set up click handler for skipping typing
        this.scene.input.once('pointerdown', () => {
            if (this.dialogueBox.isTyping) {
                this.dialogueBox.skipOrHide();
            }
        });
    }

    // clear the conversation queue
    clear() {
        this.conversationQueue = [];
        this.isInConversation = false;
        if (this.dialogueBox) {
            this.dialogueBox.hide();
        }
    }
} 