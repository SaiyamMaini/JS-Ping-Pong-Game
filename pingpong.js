const INITTIAL_VELOCITY = 0.0025;
var start = false;
let score = 500;
let highScore = 0;
let hue = 0;
localStorage.setItem("Rod1" , '500');
localStorage.setItem("Rod2" , '500');
// creating the ball class
class Ball{
    constructor(ballelement){
        this.ballelement = ballelement;
        this.reset();
            
    }

    // To set the value of --x
    get x(){
        return parseFloat(getComputedStyle(this.ballelement).getPropertyValue('--x'));
    }

    set x(value){
        this.ballelement.style.setProperty('--x' , value);
    }

    
    // To set the value of --y
    get y(){
        return parseFloat(getComputedStyle(this.ballelement).getPropertyValue('--y'));
    }

    set y(value){
        this.ballelement.style.setProperty('--y' , value);
    }


    rect(){
        return this.ballelement.getBoundingClientRect();
    }

    // To reset
    reset(){
        if(this.rect().top <= 0){
            this.x = 50;
            this.y = 50;
            this.direction = { x: -0.75, y: -0.45 }
        }else{
        this.x = 50;
        this.y = 50;
        this.direction = { x: 0.75, y: 0.45 }


        // while(Math.abs(this.direction.y) <= 0.2 || Math.abs(this.direction.y >= 0.9)){
        //     const heading = randomNumber(0 , 2 * Math.PI);
        //     this.direction = { x: Math.cos(heading), y: Math.sin(heading)}
        // }
        
        

        }
    
    }


    update(paddleRects){
        this.y = (this.y + this.direction.y ) 
        this.x = (this.x + this.direction.x ) 
        const rect = this.rect(); 
        
        if(rect.left <= 0 || rect.right >= window.innerWidth){
            this.direction.x *= -1
        }
         
        
        if(paddleRects.some(r => isCollision(r , this.rect()))){
            this.direction.y *= -1
            scoreUpdate(score);
            score += 500;
        }
            
        
    }



}


function randomNumber(min , max){
    return Math.random() * (max - min) + min;
}


function isCollision(rect1 , rect2){
    return (
        rect1.top <= rect2.bottom &&
        rect1.bottom >= rect2.top &&
        rect1.right >= rect2.left &&
        rect1.left <= rect2.right 
    ) 
}



// creating paddle class

class Paddle{
    constructor(padElement){
        this.padElement = padElement;
        this.reset();
    }

    get position(){
        return parseFloat(getComputedStyle(this.padElement).getPropertyValue('--left-position'));
    }

    set position(value){
        this.padElement.style.setProperty('--left-position' , value);
    }

    reset(){
        this.position = 50;
    }

    rect(){
        return this.padElement.getBoundingClientRect();
    }
}



// Ball object
var ball = new Ball(document.getElementById('ball'));

// paddles object
var pad1 = new Paddle(document.getElementById('pad1'));
var pad2 = new Paddle(document.getElementById('pad2'));

function update(time){
if(start == true){
    //To change background color 
    hue += 0.05; // Increase hue by 0.01 in each frame
    document.documentElement.style.setProperty("--hue", hue);


    if(isLost()){
        start = false;

        if(score > highScore){
            window.alert("New High score of " + parseInt(localStorage.getItem("Highscore")));
        }

        if(ball.rect().bottom <= 0){
            window.alert("Rod 2 Wins with a score of " + parseInt(localStorage.getItem('Rod2')) + ". Max Score is " + parseInt(localStorage.getItem("Highscore")));
        }
        else{
            window.alert("Rod 1 Wins with a score of " + parseInt(localStorage.getItem('Rod1')) + ". Max Score is " + parseInt(localStorage.getItem("Highscore")))
        }
        console.log("lost");
         ball.reset();
         pad1.reset();
         pad2.reset();
         scoreReset();
         score =  500;
    }
    
    ball.update([pad1.rect() , pad2.rect()]);
    
    
   requestAnimationFrame(update);
}
}

function isLost(){
    return ball.rect().bottom <= 0 || ball.rect().top >= (window.innerHeight );
}



// To upadte score

function scoreUpdate(){
    localStorage.setItem("Rod1" , score);
    localStorage.setItem("Rod2" , score);
    if(score > highScore){
    localStorage.setItem("Highscore" , score);
    highScore = score;
    }
    localStorage.setItem("Highscore" , highScore);
}

function scoreReset(){
    localStorage.setItem("Rod1" , "0");
    localStorage.setItem("Rod2" , "0");
}




document.addEventListener('keydown' , function(event){
    if(start == true){
    var step = 5;
    if(event.key === 'a'){
        
        if(pad1.position  <= 5){
            return;
        }
        pad1.position = pad1.position - step;
        pad2.position = pad2.position - step;
    }
    else if(event.key === 'd'){
        if (pad1.position >= 95) { 
            return;
        }
        pad1.position = pad1.position + step;
        pad2.position = pad2.position + step;
    }

}
   
})


//To start the game
window.addEventListener('keypress' , function(e){
    localStorage.setItem("Highscore" , highScore);
    
    if(e.key == 'Enter'){
        
        localStorage.setItem("Rod1" , '500');
        localStorage.setItem("Rod2" , '500');
        if(parseInt(localStorage.getItem("Highscore")) === 0){
           window.alert("This is your First Time")
        }
        else{
    window.alert(parseInt(localStorage.getItem("Highscore")) + " is the Highest Score");
        }
        localStorage.setItem("Highscore" , '500');
    requestAnimationFrame(update);
    start = true;
    }
})


localStorage.clear();