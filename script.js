const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// Tamaño del canvas
canvas.width = 400;
canvas.height = 400;

// Tamaño de las celdas
const cellSize = 20;

// Configuración del juego
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;

// Generar comida al azar
function spawnFood() {
  food.x = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
  food.y = Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize;
}

// Dibujar la serpiente
function drawSnake() {
  ctx.fillStyle = "lime";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
  });
}

// Dibujar la comida
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, cellSize, cellSize);
}

// Mover la serpiente
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Verificar colisiones con paredes
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    alert(`Game Over! Tu puntuación es: ${score}`);
    resetGame();
    return;
  }

  // Añadir nueva cabeza
  snake.unshift(head);

  // Verificar si la serpiente come la comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    spawnFood();
  } else {
    // Quitar la cola si no comió
    snake.pop();
  }
}

// Reiniciar el juego
function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: 0, y: 0 };
  score = 0;
  document.getElementById("score").textContent = score;
  spawnFood();
}

// Dibujar el tablero
function drawBoard() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Controlar la dirección
function changeDirection(event) {
  const key = event.key;
  if (key === "ArrowUp" && direction.y === 0) {
    direction = { x: 0, y: -cellSize };
  } else if (key === "ArrowDown" && direction.y === 0) {
    direction = { x: 0, y: cellSize };
  } else if (key === "ArrowLeft" && direction.x === 0) {
    direction = { x: -cellSize, y: 0 };
  } else if (key === "ArrowRight" && direction.x === 0) {
    direction = { x: cellSize, y: 0 };
  }
}

// Bucle principal del juego
function gameLoop() {
  drawBoard();
  drawFood();
  drawSnake();
  moveSnake();
}

// Inicializar el juego
function startGame() {
  resetGame();
  document.addEventListener("keydown", changeDirection);
  setInterval(gameLoop, 100);
}

// Iniciar
startGame();
