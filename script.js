const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreValue');
const startButton = document.getElementById('startButton');

// Game settings
const BOX_SIZE = 20;
const GRID_SIZE = 20;
const GAME_SPEED = 100;

// Setup canvas
canvas.width = BOX_SIZE * GRID_SIZE;
canvas.height = BOX_SIZE * GRID_SIZE;

// Game state
let snake = [];
let food = null;
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let score = 0;
let gameLoop = null;
let isPlaying = false;

function initGame() {
    snake = [
        {x: 6 * BOX_SIZE, y: 6 * BOX_SIZE},
        {x: 5 * BOX_SIZE, y: 6 * BOX_SIZE},
        {x: 4 * BOX_SIZE, y: 6 * BOX_SIZE}
    ];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    scoreDisplay.textContent = score;
    spawnFood();
}

function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE) * BOX_SIZE,
            y: Math.floor(Math.random() * GRID_SIZE) * BOX_SIZE
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ffff' : '#0099ff';
        ctx.fillRect(segment.x, segment.y, BOX_SIZE - 1, BOX_SIZE - 1);
    });

    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, BOX_SIZE - 1, BOX_SIZE - 1);
}

function moveSnake() {
    const head = {...snake[0]};
    
    direction = nextDirection;
    switch(direction) {
        case 'UP': head.y -= BOX_SIZE; break;
        case 'DOWN': head.y += BOX_SIZE; break;
        case 'LEFT': head.x -= BOX_SIZE; break;
        case 'RIGHT': head.x += BOX_SIZE; break;
    }

    if (isCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }
}

function isCollision(position) {
    return position.x < 0 || 
           position.x >= canvas.width || 
           position.y < 0 || 
           position.y >= canvas.height ||
           snake.slice(1).some(segment => 
               segment.x === position.x && segment.y === position.y
           );
}

function gameOver() {
    isPlaying = false;
    clearInterval(gameLoop);
    startButton.style.display = 'block';
    alert(`Game Over! Score: ${score}`);
}

function startGame() {
    initGame();
    isPlaying = true;
    startButton.style.display = 'none';
    gameLoop = setInterval(() => {
        moveSnake();
        draw();
    }, GAME_SPEED);
}

document.addEventListener('keydown', (event) => {
    if (!isPlaying) return;

    const keyDirections = {
        'ArrowUp': { key: 'UP', opposite: 'DOWN' },
        'ArrowDown': { key: 'DOWN', opposite: 'UP' },
        'ArrowLeft': { key: 'LEFT', opposite: 'RIGHT' },
        'ArrowRight': { key: 'RIGHT', opposite: 'LEFT' }
    };

    const newDirection = keyDirections[event.key];
    if (newDirection && direction !== newDirection.opposite) {
        nextDirection = newDirection.key;
    }
});

startButton.addEventListener('click', startGame);
draw();