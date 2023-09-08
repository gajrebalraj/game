const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = canvas.height / 2;
let birdVelocity = 0;
const gravity = 0.15;
const birdRadius = 15; // Bird radius
const pipeWidth = 50;
const pipeGap = 150;
let pipes = [];
let score = 0;
let pipeTimer = 0;
let highScore = 0;



function generateRandomPipeHeight() {
    return Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 25;
}

function drawBird() {
    ctx.fillStyle = "#f00"; // Bird color
    ctx.beginPath();
    ctx.arc(50 + birdRadius, birdY + birdRadius, birdRadius, 0, Math.PI * 2); // Bird dimensions
    ctx.fill();
}
document.addEventListener("touchstart", () => {
    birdVelocity = -5;
});

function drawPipe(x, upperPipeHeight) {
    const lowerPipeHeight = canvas.height - upperPipeHeight - pipeGap;

    ctx.fillStyle = "#00f"; // Pipe color
    ctx.fillRect(x, 0, pipeWidth, upperPipeHeight); // Upper pipe
    ctx.fillRect(x, upperPipeHeight + pipeGap, pipeWidth, lowerPipeHeight); // Lower pipe
}

function updateBird() {
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdY > canvas.height - birdRadius) {
        birdY = canvas.height - birdRadius;
        birdVelocity = 0;
    }

    if (birdY < birdRadius) {
        birdY = birdRadius;
        birdVelocity = 0;
    }
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2; // Adjust this value to control pipe speed

        const birdBox = {x: 50, y: birdY, width: birdRadius * 2, height: birdRadius * 2};
        const upperPipeBox = {x: pipes[i].x, y: 0, width: pipeWidth, height: pipes[i].upperPipeHeight};
        const lowerPipeBox = {x: pipes[i].x, y: pipes[i].upperPipeHeight + pipeGap, width: pipeWidth, height: canvas.height - pipes[i].upperPipeHeight - pipeGap};

        if (checkCollision(birdBox, upperPipeBox) || checkCollision(birdBox, lowerPipeBox)) {
            if (score > highScore) {
                highScore = score;
            }
            resetGame();
            return;
        }

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }

    pipeTimer++;

    if (pipeTimer % 120 === 0) { // Changed to 60 for 1 second interval
        const upperPipeHeight = generateRandomPipeHeight();
        pipes.push({ x: canvas.width, upperPipeHeight });
    }
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        drawPipe(pipes[i].x, pipes[i].upperPipeHeight);
    }
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 200, 30);
}

function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    pipeTimer = 0;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}
window.addEventListener('load', () => {
    highScore = parseInt(localStorage.getItem('highScore')) || 0;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    updateBird();
    drawPipes();
    updatePipes();
    drawScore();
    requestAnimationFrame(gameLoop);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}




document.addEventListener("keydown", () => {
    birdVelocity = -5; // Adjust this value to change jump strength
});

gameLoop();
