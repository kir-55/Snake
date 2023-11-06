const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
var snakeElements = [];
var dirs = [0]
var currentDir = 0;
var xPos = 0, yPos = 0;
var xOld = 0, yOld = 0;
var xStart = 0, yStart = 0; 
var intervalID;
var applesAmount = 30;
var apples = [];
var mapHight = 10;
var mapWidth = 10;
var gameRun = false;
var lastStepTime;
var maxStepDelay = 500;

gameStart();

function gameLoop(){
    if(Date.now() - lastStepTime >= maxStepDelay)
        gameStep();
}

function gameStart(){
    gameRun = true;
    snakeElements.splice(0, snakeElements.length);
    xPos = xOld = xStart = random(0, 10);
    yPos = yOld = yStart = random(0, 10);

    preshow();

    document.getElementById("log").innerText = "Press WSAD to start!";
    document.addEventListener('keyup', function(event) {
        const key = event.key; // "a", "1", "Shift", etc.
        if(gameRun){
            if(key == "a"){
                if(dirs.length < 1 || dirs[dirs.length - 1] != 3 && dirs[dirs.length - 1] != 1){
                    dirs.push(1);
                    gameStep();
                }
                    
            }
            else if(key == "w"){
                if(dirs.length < 1 || dirs[dirs.length - 1] != 4 && dirs[dirs.length - 1] != 2){
                    dirs.push(2);
                    gameStep();
                }   
            }
            else if(key == "d"){
                if(dirs.length < 1 || dirs[dirs.length - 1] != 1 && dirs[dirs.length - 1] != 3){
                    dirs.push(3);
                    gameStep();
                } 
            }
            else if(key == "s"){
                if(dirs.length < 1 || dirs[dirs.length - 1] != 2 && dirs[dirs.length - 1] != 4){
                    dirs.push(4);
                    gameStep();
                }  
            }
            else 
                return;


            if(intervalID == null)
                intervalID = window.setInterval(gameLoop, 50);
        }
        
    });
}

function generateApples(amount, appleTochange = -1){
    
    for(j = 0; j < amount; j++){
        while (apples.length < amount)
            apples.push([0,0])

        var x = random(0,mapWidth);
        var y = random(0,mapHight);
        var tries = 0;
        while (checkIfEmpty(x, y) == false){  
            tries++;
            if(tries >= (mapHight * mapWidth)){
                return;
            }
            x = random(0, mapWidth);
            y = random(0,mapHight);
           
        }
        if(appleTochange >= 0 && appleTochange < apples.length){
            apples[appleTochange][0] = x;
            apples[appleTochange][1] = y;
        }
        else{
            apples[j][0] = x;
            apples[j][1] = y;
        }
                      
        
    }       
}

function checkIfEmpty(x, y)
{
    var m = 0;
    while (m < snakeElements.length){
        if(x == snakeElements[m][0] && y == snakeElements[m][1])
            return false;
        else
            m++;
    }
    m = 0;
    while (m < apples.length){
        if(x == apples[m][0] && y == apples[m][1])
            return false;
        else
            m++;
    }
    return true;
}


function gameRestart(){
    gameOver();
    gameStart();
}

function drawMap(){
    for(y = 0; y < mapHight; y++){
        for(x = 0; x < mapWidth; x++){
            ctx.fillStyle = (x + y)%2? "#222222": "#111111";
            ctx.fillRect(x * 40, y * 40, 40, 40);
        }
    }
}

function drawSnake(){
    
    for(k = 0; k < snakeElements.length; k++){
        ctx.fillStyle = 'rgb(44,' +  (255 - k*2) + ', 44)';
        ctx.fillRect(snakeElements[k][0] * 40, snakeElements[k][1] * 40, 40, 40);
    }
        
}

function moveHead(){
    xOld = xPos;
    yOld = yPos;

    decideDirection();

    snakeElements[0][0] = xPos;
    snakeElements[0][1] = yPos;
}

function moveBody(){
    for(i = 1; i < snakeElements.length; i++){
        var xOld1 = snakeElements[i][0];
        var yOld1 = snakeElements[i][1];

        snakeElements[i][0] = xOld;
        snakeElements[i][1] = yOld;

        xOld = xOld1;
        yOld = yOld1;
    }
}

function decideDirection(){
    if(!(currentDir >= dirs.length)){
        if(currentDir + 1 < dirs.length)
            currentDir++;

        if(dirs[currentDir] == 1)
            xPos--;
        else if(dirs[currentDir] == 2)
            yPos--;
        else if(dirs[currentDir] == 3)
            xPos++;
        else if(dirs[currentDir] == 4)
            yPos++;

        if(currentDir + 1 < dirs.length)
            currentDir++;
    }
}


function preshow(){
    snakeElements.push([xStart, yStart]);
    drawMap();
    drawSnake();
    generateApples(applesAmount);
    drawApples();
}

function drawApples(){
    for(h = 0; h < apples.length; h++)
    {
        ctx.fillStyle = "#ff2222";
        ctx.fillRect(apples[h][0] * 40, apples[h][1] * 40, 40, 40);
    }
}

function checkForCollisions(){
    if((xPos >= 10)
    || (xPos < 0)
    || (yPos >= 10)
    || (yPos < 0))
    {
        gameOver();
        return;
    }

    for(l = 1; l < snakeElements.length; l++){
        if((snakeElements[l][0] == snakeElements[0][0])
        && (snakeElements[l][1] == snakeElements[0][1])){
            gameOver();
            return;
        }
    }

    for(h = 0; h < apples.length; h++)
        if(snakeElements[0][0] == apples[h][0] && snakeElements[0][1] == apples[h][1]){
            snakeElements.push([xOld, yOld]);       
            generateApples(1, h);
        }
}



function gameStep() {
    console.log("game step");
    lastStepTime = Date.now();
    drawMap();
    drawApples();
    moveHead();
    moveBody();
    drawSnake();
    checkForCollisions();
}

function gameOver(){
    gameRun = false;
    window.clearInterval(intervalID);
    intervalID = null;
    dirs.splice(0, dirs.length);
    document.getElementById("log").innerText = "Your score is: " + snakeElements.length;
    
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}