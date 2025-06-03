export default class Slides {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.slideNum = 1;  // Make it a class property
       
        // dom styling
        this.img = document.createElement('img');
        this.img.id = 'slides';

        this.next = document.createElement('img');
        this.next.id = 'next';
        this.run = document.createElement('img');
        this.run.id = 'run';
        
        // append to game
        const canvas = document.querySelector('canvas');
        const gameContainer = canvas.parentElement;
        if (gameContainer) {
            gameContainer.appendChild(this.img);
            gameContainer.appendChild(this.next);
            gameContainer.appendChild(this.run);
        }

        this.img.src = 'assets/chase/slide1.png';
        this.next.src = 'assets/chase/next.png';
        this.run.src = 'assets/chase/RUN.png';

        this.runbtn = document.getElementById('run');

        this.next.addEventListener('click', () => {
            if (this.slideNum === 1) {
                this.img.src = 'assets/chase/slide2.png';
                this.slideNum = 2;
            } else if (this.slideNum === 2) {
                this.img.src = 'assets/chase/slide3.png';
                this.next.style.display = 'none';
                this.slideNum = 3;
                // show run btn
                this.run.style.display = 'block';
            }
        });

        this.run.addEventListener('click', () => {
            // hide slides
            this.img.style.display = 'none';
            this.run.style.display = 'none';
            // start game
            this.scene.startGame();
        });
    }
}