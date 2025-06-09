export default class PhoneScene extends Phaser.Scene {
    constructor() {
        super('PhoneScene');
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

        // messages
        this.addMessage("Good morning, my love <3", 'idolmed');
        this.addMessage("good morningggg", 'msgshort');
        this.addMessage("did u miss me :3", 'msgshort');
        this.addMessage("Of course.", 'idolshort');
        this.addMessage("You're the last thing I think of when I fall asleep.", 'idollong');
        this.addMessage("And the first thing I think of when I wake up.", 'idollong');
        this.addMessage("omgggg stopp u flirt", 'msgshort');
        this.addMessage("i missed u too bb hehe", 'msgshort');
        this.addMessage("Do you have any plans for tonight?", 'idolmed');
        this.addMessage("???", 'msgshort');
        this.addMessage("omg", 'msgshort');
        this.addMessage("no why", 'msgshort');
        this.addMessage("I'm having a surprise concert in your city tonight.", 'idollong');
        this.addMessage("I would love for you to come.", 'idolmed');
        this.addMessage("OMGOMG OF COURSE BABE", 'msgshort');
        this.addMessage("It would mean the world to me if you attended the meet and greet.", 'idollong');
        this.addMessage("There's nothing I want more than to finally meet you in person.", 'idollong');
        this.addMessage("???", 'msgshort');
        this.addMessage("babe don't be silly", 'msgshort');
        this.addMessage("we've met before", 'msgshort');
        this.addMessage("Of course I remember.", 'idolshort');
        this.addMessage("I say that because my heart races everytime I see you", 'idollong');
        this.addMessage("So it feels like we are meeting for the first time again.", 'idollong');
        this.addMessage("AWE BABEEEE", 'msgshort');
        this.addMessage("Here's the link to buy tickets.", 'idolmed');
        this.addMessage("Because you are my love, I'm giving you a special discount.", 'idollong');
        this.addMessage('', 'idollong');

        // show first message automatically after a short delay
        this.time.delayedCall(500, () => {
            if (this.messageQueue.length > 0) {
                const nextMessage = this.messageQueue.shift();
                this.showMessage(nextMessage.text, nextMessage.bubble);
            }
        });

        //click handler for showing msgs
        this.input.on('pointerdown', () => {
            if (this.messageQueue.length > 0) {
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
                        const ticketLink = document.createElement('div');
                        ticketLink.id = 'ticketLink';
                        ticketLink.textContent = 'CLICK HERE TO BUY TICKETS';
                        
                        // add to game container
                        const gameContainer = document.querySelector('canvas').parentElement;
                        gameContainer.appendChild(ticketLink);

                        //link to next scene
                        ticketLink.addEventListener('click', () => {
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
                            this.scene.start('TicketScene');
                        });
                    }
                }
            });
        });
    }

    update() {
    }
}