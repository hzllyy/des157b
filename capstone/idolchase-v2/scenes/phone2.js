export default class PhoneSecondScene extends Phaser.Scene {
    constructor() {
        super('PhoneSecondScene');
        this.messages = [];
        this.messageQueue = []; 
        this.baseSpacing = 30; 
    }

    preload() {
        this.load.image('phonebg', 'assets/phone/phone-bg.PNG');
        this.load.image('msgshort', 'assets/phone/lucy-msg-short.PNG');
        this.load.image('msgmed', 'assets/phone/lucy-msg-med.PNG');
        this.load.image('msglong', 'assets/phone/lucy-msg-long.PNG');
        this.load.image('idolshort', 'assets/phone/idol-msg-short.PNG');
        this.load.image('idolmed', 'assets/phone/idol-msg-med.PNG');
        this.load.image('idollong', 'assets/phone/idol-msg-long.PNG');
    }

    create() {
        this.add.image(0, 0, 'phonebg').setOrigin(0, 0);


        //click handler for showing msgs
        this.input.on('pointerdown', () => {
            if (this.messageQueue.length > 0) {
                // Check and remove any messages that should be gone
                this.messages.forEach((msg, index) => {
                    const bubbleTop = msg.container.y - msg.bubble.height;
                    if (bubbleTop <= 50) {
                        const msgIndex = this.messages.indexOf(msg);
                        if (msgIndex !== -1) {
                            this.messages.splice(msgIndex, 1);
                            msg.container.destroy();
                            if (msg.textElement && msg.textElement.parentNode) {
                                msg.textElement.parentNode.removeChild(msg.textElement);
                            }
                        }
                    }
                });

                // add a small delay
                this.time.delayedCall(100, () => {
                    const nextMessage = this.messageQueue.shift();
                    this.showMessage(nextMessage.text, nextMessage.bubble);
                });
            }
        });

        // messages
        this.addMessage("Thank you for buying tickets, love. I can't wait to see you tonight.", 'idollong');
        this.addMessage("asdfghhsadlo", 'msgshort');
        this.addMessage("im so excitedddd", 'msgshort');
        this.addMessage("ill bring u a gift", 'msgshort');
        this.addMessage("wat do u want???", 'msgshort');
        this.addMessage("I'll treasure anything you give me, love", 'idolmed');
        this.addMessage("okk wellll", 'msgshort');
        this.addMessage("wats ur fave color??", 'msgshort');
        this.addMessage("My favorite color is blue.", 'idolmed');
        this.addMessage("my fave is red!!!!", 'msgshort');
        this.addMessage("Well, since red and blue together makes purple, my favorite color is now purple.", 'idollong');
        this.addMessage("omgggg stoppp hehehe", 'msgshort');
        
    }

    addMessage(text, bubbleType) {
        // add msg to queue
        this.messageQueue.push({
            text: text,
            bubble: bubbleType
        });
    }

    showMessage(text, bubbleType) {
        const messageContainer = this.add.container(0, 0);
        
        // add text bubble with origin at bottom center
        const bubble = this.add.image(0, 0, bubbleType).setOrigin(0.5, 1);
        messageContainer.add(bubble);

        // calc spacing based on bubble height
        const bubbleHeight = bubble.height;
        const spacing = this.baseSpacing + (bubbleHeight - 15); 

        // dom text element
        const textElement = document.createElement('div');
        textElement.className = 'texts';
        textElement.textContent = text;
        textElement.style.position = 'absolute';
        textElement.style.left = '20%';
        textElement.style.transform = 'translateX(-52%)';
        textElement.style.fontSize = '16px';
        textElement.style.transition = 'top 280ms cubic-bezier(0.4, 0, 0.2, 1)';
        textElement.style.top = ((this.cameras.main.height - bubbleHeight) * 2.5) + 'px';

        // stick onto game container
        const gameContainer = document.querySelector('canvas').parentElement;
        gameContainer.appendChild(textElement);

        // set initial position at bottom for new message
        messageContainer.setPosition(
            this.cameras.main.width / 2 - 2,
            this.cameras.main.height - 70
        );

        //add messages to array
        this.messages.push({
            container: messageContainer,
            textElement: textElement,
            spacing: spacing,
            bubbleType: bubbleType,
            bubble: bubble // Store reference to the bubble
        });

        // update all message positions
        this.messages.forEach((msg, index) => {
            // calculate positions from top
            const reverseIndex = this.messages.length - 1 - index;
            
            // calculate bubble position with dynamic spacing
            let totalSpacing = 0;
            for (let i = 0; i < reverseIndex; i++) {
                totalSpacing += this.messages[this.messages.length - 1 - i].spacing;
            }
            
            // calculate target Y position
            let targetY = this.cameras.main.height - 70 - totalSpacing;
            
            // get bubble height based on type
            let bubbleHeight;
            switch(msg.bubbleType) {
                case 'idollong':
                    bubbleHeight = 35;
                    break;
                case 'idolmed':
                    bubbleHeight = 25;
                    break;
                case 'idolshort':
                case 'msgshort':
                    bubbleHeight = 15;
                    break;
                default:
                    bubbleHeight = 15;
            }

            // clamp the target position to prevent going above removal line
            const minY = 55 + bubbleHeight; // keep bubble below removal line
            targetY = Math.max(targetY, minY);
            
            // Set the target position for the text first
            const scaledY = (targetY - bubbleHeight) * 2.5;
            msg.textElement.style.top = scaledY - 310 + 'px';
            
            // animate bubble with a small delay to sync with CSS
            this.tweens.add({
                targets: msg.container,
                y: targetY,
                duration: 300,
                delay: 10, 
                ease: 'Power2',
                onComplete: () => {
                    // if message is at the removal line, remove it
                    if (msg.container.y <= minY) {
                        const msgIndex = this.messages.indexOf(msg);
                        if (msgIndex !== -1) {
                            this.messages.splice(msgIndex, 1);
                            msg.container.destroy();
                            if (msg.textElement && msg.textElement.parentNode) {
                                msg.textElement.parentNode.removeChild(msg.textElement);
                            }
                        }
                    }

                    // check if this is the last message in the queue
                    if (this.messageQueue.length === 0 && index === this.messages.length - 1) {
                       
                        this.time.delayedCall(2000, () => {
                            // clean up dom elements
                            const gameContainer = document.querySelector('canvas').parentElement;
                            
                            // remove all elements except canvas
                            while (gameContainer.firstChild) {
                                if (gameContainer.firstChild.tagName !== 'CANVAS') {
                                    gameContainer.removeChild(gameContainer.firstChild);
                                } else {
                                    gameContainer.appendChild(gameContainer.firstChild);
                                    break;
                                }
                            }
                            
                            // clear messages array
                            this.messages = [];
                            
                            // start next scene
                            this.scene.start('RoomScene');
                        });
                    }
                }
            });
        });
    }

    update() {
    }
}