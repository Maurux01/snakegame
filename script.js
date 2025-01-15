const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Size of each grid square
let snake = [{ x: 8 * box, y: 8 * box }];
let direction = 'RIGHT';
let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box
};
let score = 0;

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  if (event.key === 'ArrowUp' && direction !== 'DOWN') {
    direction = 'UP';
  } else if (event.key === 'ArrowDown' && direction !== 'UP') {
    direction = 'DOWN';
  } else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
    direction = 'LEFT';
  } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
    direction = 'RIGHT';
  }
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);
}

function drawSnake() {
  ctx.fillStyle = 'lime';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, box, box);
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
      y: Math.floor(Math.random() * (canvas.height / box)) * box
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
    alert(`Game Over! Your score: ${score}`);
    document.location.reload();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
  updateSnake();
}

setInterval(draw, 100); // Game loop every 100ms
