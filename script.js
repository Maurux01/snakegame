const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseButton = document.getElementById('pauseButton');
const speedSelector = document.getElementById('speed');

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box,
};
let score = 0;
let gameInterval;
let isPaused = false;
let speed = 100;

// Add event listeners
document.addEventListener('keydown', changeDirection);
pauseButton.addEventListener('click', togglePause);
speedSelector.addEventListener('change', changeSpeed);

function changeDirection(event) {
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function togglePause() {
  if (isPaused) {
    gameInterval = setInterval(draw, speed);
    pauseButton.textContent = 'Pause';
  } else {
    clearInterval(gameInterval);
    pauseButton.textContent = 'Resume';
  }
  isPaused = !isPaused;
}

function changeSpeed() {
  speed = parseInt(speedSelector.value, 10);
  if (!isPaused) {
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, speed);
  }
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'lime' : '#32cd32';
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(segment.x, segment.y, box, box);
  });
}

function updateSnake() {
  const head = { x: snake[0].x, y: snake[0].y };

  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
  } else {
    snake.pop();
  }

  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    setTimeout(() => {
      alert(`Game Over! Your final score is ${score}. Play again?`);
      document.location.reload();
    }, 100);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
  updateSnake();
}

// Start the game
gameInterval = setInterval(draw, speed);
}
