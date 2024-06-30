let lastPaintTime = 0;
let speed = 5;
let board = document.querySelector(".board")
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let scoreDiv = document.querySelector(".score");
let HiscoreDiv = document.querySelector(".hiscore");

let score = 0;
let hiscoreval = 0;

let snakeArr = [{x:15,y:13}];
let inputDir = {x:0,y:0};
let foodArr = {x:3,y:9};

function main(ctime) {
    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (ctime - lastPaintTime) / 1000;
    if (secondsSinceLastRender < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake){
    for(let i=1;i<snake.length;i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            return true;
        }
    }
    if(snake[0].x >18 || snake[0].x<0 || snake[0].y >18 || snake[0].y<0){
        return true;
    }
    return false;
}

function gameEngine(){
    // if collide 
    if(isCollide(snakeArr)){
        gameOverSound.play();
        alert('Game is over, try again!')
        snakeArr = [{x:15,y:13}];
        inputDir = {x:0,y:0};
        score = 0;
        scoreDiv.innerHTML = "Score : " + score;
        musicSound.pause();
    }

    // if snake eats food 
    if(snakeArr[0].x == foodArr.x && snakeArr[0].y == foodArr.y){
        score += 1;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            HiscoreDiv.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreDiv.innerHTML = "Score : " + score;
        foodSound.play();
        snakeArr.unshift({x:snakeArr[0].x+inputDir.x,y:snakeArr[0].y+inputDir.y});
        let a=2,b=16;
        foodArr = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    //moving the snake
    for(let i=snakeArr.length-2;i>=0;i--){
        snakeArr[i+1] = {...snakeArr[i]}
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // displaying snake 
    board.innerHTML = "";    
    snakeArr.forEach((e,index) => {
        let snakeEle = document.createElement('div');
        snakeEle.style.gridRowStart = e.y;
        snakeEle.style.gridColumnStart = e.x;
        if(index == 0){
            snakeEle.classList.add('head');
        }
        else{
            snakeEle.classList.add('main');
        }
        board.appendChild(snakeEle);
    });
    // displaying food 
    let foodEle = document.createElement('div');
    foodEle.classList.add('food');
    foodEle.style.gridRowStart = foodArr.y;
    foodEle.style.gridColumnStart = foodArr.x;
    board.appendChild(foodEle);
}


let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    HiscoreDiv.innerHTML = "HiScore: " + hiscore;
}

document.addEventListener('keydown', function(event) {
    moveSound.play();
    musicSound.play();
    switch (event.key) {
        case 'ArrowUp':
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case 'ArrowDown':
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case 'ArrowLeft':
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case 'ArrowRight':
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
window.requestAnimationFrame(main);