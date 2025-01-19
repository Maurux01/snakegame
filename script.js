const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseButton = document.getElementById('pauseButton');
const speedSelector = document.getElementById('speedSelector');
const scoreElement = document.getElementById('score');

// Game constants
const BOX_SIZE = 20;
const GRID_SIZE = 30;
canvas.width = BOX_SIZE * GRID_SIZE;
canvas.height = BOX_SIZE * GRID_SIZE;

// Game states
const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Game configuration
const FOOD_TYPES = {
    NORMAL: { color: '#ff0000', points: 1, probability: 0.8 },
    SPECIAL: { color: '#ffd700', points: 3, probability: 0.15 },
    SUPER: { color: '#ff00ff', points: 5, probability: 0.05 }
};

// Game state
let gameState = GAME_STATES.MENU;
let snake = [];
let food = {};
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let speed = 100;
let particles = [];

// Sound effects
const sounds = {
    eat: new Audio('eat.mp3'),
    die: new Audio('die.mp3'),
    special: new Audio('special.mp3')
};

function initGame() {
    snake = [{ x: 10 * BOX_SIZE, y: 10 * BOX_SIZE }];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    generateFood();
    updateScore();
}

function generateFood() {
    const type = decideFoodType();
    food = {
        x: Math.floor(Math.random() * GRID_SIZE) * BOX_SIZE,
        y: Math.floor(Math.random() * GRID_SIZE) * BOX_SIZE,
        type: type
    };
}

function decideFoodType() {
    const rand = Math.random();
    if (rand < FOOD_TYPES.SUPER.probability) return 'SUPER';
    if (rand < FOOD_TYPES.SPECIAL.probability) return 'SPECIAL';
    return 'NORMAL';
}

function createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x,
            y,
            velocity: {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            },
            radius: Math.random() * 3,
            color,
            alpha: 1
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha -= 0.02;
        
        if (particle.alpha <= 0) particles.splice(i, 1);
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function updateScore() {
    scoreElement.textContent = `Score: ${score} | High Score: ${highScore}`;
}

function gameOver() {
    sounds.die.play();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }
    gameState = GAME_STATES.GAME_OVER;
    clearInterval(gameLoop);
    drawGameOver();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#333333';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            ctx.strokeRect(i * BOX_SIZE, j * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        }
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = `hsl(${120 + index * 2}, 100%, 50%)`;
        ctx.fillRect(segment.x, segment.y, BOX_SIZE - 2, BOX_SIZE - 2);
    });
    
    // Draw food
    ctx.fillStyle = FOOD_TYPES[food.type].color;
    ctx.fillRect(food.x, food.y, BOX_SIZE - 2, BOX_SIZE - 2);
    
    // Draw particles
    drawParticles();
}

function update() {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    direction = nextDirection;
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'UP': head.y -= BOX_SIZE; break;
        case 'DOWN': head.y += BOX_SIZE; break;
        case 'LEFT': head.x -= BOX_SIZE; break;
        case 'RIGHT': head.x += BOX_SIZE; break;
    }
    
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height) {
        return gameOver();
    }
    
    // Self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return gameOver();
    }
    
    snake.unshift(head);
    
    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score += FOOD_TYPES[food.type].points;
        sounds.eat.play();
        createParticles(food.x, food.y, FOOD_TYPES[food.type].color);
        generateFood();
        updateScore();
    } else {
        snake.pop();
    }
    
    updateParticles();
}

function changeDirection(event) {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    const keyDirections = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT'
    };
    
    const newDirection = keyDirections[event.key];
    if (!newDirection) return;
    
    const opposites = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT'
    };
    
    if (opposites[newDirection] !== direction) {
        nextDirection = newDirection;
    }
}

function start() {
    gameState = GAME_STATES.PLAYING;
    initGame();
    gameLoop = setInterval(() => {
        update();
        drawGame();
    }, speed);
}

function togglePause() {
    if (gameState === GAME_STATES.PLAYING) {
        gameState = GAME_STATES.PAUSED;
        clearInterval(gameLoop);
    } else if (gameState === GAME_STATES.PAUSED) {
        gameState = GAME_STATES.PLAYING;
        gameLoop = setInterval(() => {
            update();
            drawGame();
        }, speed);
    }
}

// Event listeners
document.addEventListener('keydown', changeDirection);
pauseButton.addEventListener('click', togglePause);
speedSelector.addEventListener('change', (e) => {
    speed = parseInt(e.target.value);
    if (gameState === GAME_STATES.PLAYING) {
        clearInterval(gameLoop);
        gameLoop = setInterval(() => {
            update();
            drawGame();
        }, speed);
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        changeDirection({ key: deltaX > 0 ? 'ArrowRight' : 'ArrowLeft' });
    } else {
        changeDirection({ key: deltaY > 0 ? 'ArrowDown' : 'ArrowUp' });
    }
    
    touchStartX = touchEndX;
    touchStartY = touchEndY;
});

// Start the game
start();
function updateScore() {
    scoreElement.textContent = `Score: ${score} | High Score: ${highScore}`;
}

function gameOver() {
    sounds.die.play();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }
    gameState = GAME_STATES.GAME_OVER;
    clearInterval(gameLoop);
    drawGameOver();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#333333';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            ctx.strokeRect(i * BOX_SIZE, j * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        }
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = `hsl(${120 + index * 2}, 100%, 50%)`;
        ctx.fillRect(segment.x, segment.y, BOX_SIZE - 2, BOX_SIZE - 2);
    });
    
    // Draw food
    ctx.fillStyle = FOOD_TYPES[food.type].color;
    ctx.fillRect(food.x, food.y, BOX_SIZE - 2, BOX_SIZE - 2);
    
    // Draw particles
    drawParticles();
}

function update() {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    direction = nextDirection;
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'UP': head.y -= BOX_SIZE; break;
        case 'DOWN': head.y += BOX_SIZE; break;
        case 'LEFT': head.x -= BOX_SIZE; break;
        case 'RIGHT': head.x += BOX_SIZE; break;
    }
    
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height) {
        return gameOver();
    }
    
    // Self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return gameOver();
    }
    
    snake.unshift(head);
    
    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score += FOOD_TYPES[food.type].points;
        sounds.eat.play();
        createParticles(food.x, food.y, FOOD_TYPES[food.type].color);
        generateFood();
        updateScore();
    } else {
        snake.pop();
    }
    
    updateParticles();
}

function changeDirection(event) {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    const keyDirections = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT'
    };
    
    const newDirection = keyDirections[event.key];
    if (!newDirection) return;
    
    const opposites = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT'
    };
    
    if (opposites[newDirection] !== direction) {
        nextDirection = newDirection;
    }
}

function start() {
    gameState = GAME_STATES.PLAYING;
    initGame();
    gameLoop = setInterval(() => {
        update();
        drawGame();
    }, speed);
}

function togglePause() {
    if (gameState === GAME_STATES.PLAYING) {
        gameState = GAME_STATES.PAUSED;
        clearInterval(gameLoop);
    } else if (gameState === GAME_STATES.PAUSED) {
        gameState = GAME_STATES.PLAYING;
        gameLoop = setInterval(() => {
            update();
            drawGame();
        }, speed);
    }
}

// Event listeners
document.addEventListener('keydown', changeDirection);
pauseButton.addEventListener('click', togglePause);
speedSelector.addEventListener('change', (e) => {
    speed = parseInt(e.target.value);
    if (gameState === GAME_STATES.PLAYING) {
        clearInterval(gameLoop);
        gameLoop = setInterval(() => {
            update();
            drawGame();
        }, speed);
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        changeDirection({ key: deltaX > 0 ? 'ArrowRight' : 'ArrowLeft' });
    } else {
        changeDirection({ key: deltaY > 0 ? 'ArrowDown' : 'ArrowUp' });
    }
    
    touchStartX = touchEndX;
    touchStartY = touchEndY;
});

// Start the game
start();const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseButton = document.getElementById('pauseButton');
const speedSelector = document.getElementById('speedSelector');
const scoreElement = document.getElementById('score');

// Game constants
const BOX_SIZE = 20;
const GRID_SIZE = 30;
canvas.width = BOX_SIZE * GRID_SIZE;
canvas.height = BOX_SIZE * GRID_SIZE;

// Game states
const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Game configuration
const FOOD_TYPES = {
    NORMAL: { color: '#ff0000', points: 1, probability: 0.8 },
    SPECIAL: { color: '#ffd700', points: 3, probability: 0.15 },
    SUPER: { color: '#ff00ff', points: 5, probability: 0.05 }
};

// Game state
let gameState = GAME_STATES.MENU;
let snake = [];
let food = {};
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let speed = 100;
let particles = [];

// Sound effects
const sounds = {
    eat: new Audio('eat.mp3'),
    die: new Audio('die.mp3'),
    special: new Audio('special.mp3')
};

function initGame() {
    snake = [{ x: 10 * BOX_SIZE, y: 10 * BOX_SIZE }];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    generateFood();
    updateScore();
}

function generateFood() {
    const type = decideFoodType();
    food = {
        x: Math.floor(Math.random() * GRID_SIZE) * BOX_SIZE,
        y: Math.floor(Math.random() * GRID_SIZE) * BOX_SIZE,
        type: type
    };
}

function decideFoodType() {
    const rand = Math.random();
    if (rand < FOOD_TYPES.SUPER.probability) return 'SUPER';
    if (rand < FOOD_TYPES.SPECIAL.probability) return 'SPECIAL';
    return 'NORMAL';
}

function createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x,
            y,
            velocity: {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            },
            radius: Math.random() * 3,
            color,
            alpha: 1
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha -= 0.02;
        
        if (particle.alpha <= 0) particles.splice(i, 1);
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function updateScore() {
    scoreElement.textContent = `Score: ${score} | High Score: ${highScore}`;
}

function gameOver() {
    sounds.die.play();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }
    gameState = GAME_STATES.GAME_OVER;
    clearInterval(gameLoop);
    drawGameOver();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#333333';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            ctx.strokeRect(i * BOX_SIZE, j * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        }
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = `hsl(${120 + index * 2}, 100%, 50%)`;
        ctx.fillRect(segment.x, segment.y, BOX_SIZE - 2, BOX_SIZE - 2);
    });
    
    // Draw food
    ctx.fillStyle = FOOD_TYPES[food.type].color;
    ctx.fillRect(food.x, food.y, BOX_SIZE - 2, BOX_SIZE - 2);
    
    // Draw particles
    drawParticles();
}

function update() {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    direction = nextDirection;
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'UP': head.y -= BOX_SIZE; break;
        case 'DOWN': head.y += BOX_SIZE; break;
        case 'LEFT': head.x -= BOX_SIZE; break;
        case 'RIGHT': head.x += BOX_SIZE; break;
    }
    
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height) {
        return gameOver();
    }
    
    // Self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return gameOver();
    }
    
    snake.unshift(head);
    
    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score += FOOD_TYPES[food.type].points;
        sounds.eat.play();
        createParticles(food.x, food.y, FOOD_TYPES[food.type].color);
        generateFood();
        updateScore();
    } else {
        snake.pop();
    }
    
    updateParticles();
}

function changeDirection(event) {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    const keyDirections = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT'
    };
    
    const newDirection = keyDirections[event.key];
    if (!newDirection) return;
    
    const opposites = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT'
    };
    
    if (opposites[newDirection] !== direction) {
        nextDirection = newDirection;
    }
}

function start() {
    gameState = GAME_STATES.PLAYING;
    initGame();
    gameLoop = setInterval(() => {
        update();
        drawGame();
    }, speed);
}

function togglePause() {
    if (gameState === GAME_STATES.PLAYING) {
        gameState = GAME_STATES.PAUSED;
        clearInterval(gameLoop);
    } else if (gameState === GAME_STATES.PAUSED) {
        gameState = GAME_STATES.PLAYING;
        gameLoop = setInterval(() => {
            update();
            drawGame();
        }, speed);
    }
}

// Event listeners
document.addEventListener('keydown', changeDirection);
pauseButton.addEventListener('click', togglePause);
speedSelector.addEventListener('change', (e) => {
    speed = parseInt(e.target.value);
    if (gameState === GAME_STATES.PLAYING) {
        clearInterval(gameLoop);
        gameLoop = setInterval(() => {
            update();
            drawGame();
        }, speed);
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        changeDirection({ key: deltaX > 0 ? 'ArrowRight' : 'ArrowLeft' });
    } else {
        changeDirection({ key: deltaY > 0 ? 'ArrowDown' : 'ArrowUp' });
    }
    
    touchStartX = touchEndX;
    touchStartY = touchEndY;
});

// Start the game
start();

// Add to existing constants
const startButton = document.getElementById('startButton');

// Add initial game state
let gameState = GAME_STATES.MENU;

// Add start button event listener
startButton.addEventListener('click', () => {
    if (gameState === GAME_STATES.MENU || gameState === GAME_STATES.GAME_OVER) {
        startGame();
    }
});

// Modify start function
function startGame() {
    gameState = GAME_STATES.PLAYING;
    initGame();
    startButton.style.display = 'none';
    gameLoop = setInterval(() => {
        update();
        drawGame();
    }, speed);
}

// Modify gameOver function
function gameOver() {
    sounds.die.play();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }
    gameState = GAME_STATES.GAME_OVER;
    clearInterval(gameLoop);
    startButton.style.display = 'block';
    startButton.textContent = 'Play Again';
    drawGameOver();
}

// Remove auto-start at the bottom of the file
// Instead of start(), initialize menu state
gameState = GAME_STATES.MENU;
drawGame();