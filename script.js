  // Previous JavaScript code remains the same, but with these enhancements:
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

      // Check if snake eats the food
      if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
          x: Math.floor(Math.random() * (canvas.width / box)) * box,
          y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
      } else {
        snake.pop(); // Remove the tail if no food eaten
      }

      // Check for collisions with walls or itself
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
        function draw() {
            // Clear canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);

            // Draw grid lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            for(let i = 0; i < GAME_SIZE; i += GRID_SIZE) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, GAME_SIZE);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(GAME_SIZE, i);
                ctx.stroke();
            }

            // Draw snake with gradient effect
            snake.forEach((segment, index) => {
                const gradient = ctx.createLinearGradient(
                    segment.x, segment.y,
                    segment.x + GRID_SIZE, segment.y + GRID_SIZE
                );
                
                if (index === 0) {
                    gradient.addColorStop(0, '#66bb6a');
                    gradient.addColorStop(1, '#43a047');
                } else {
                    gradient.addColorStop(0, '#4CAF50');
                    gradient.addColorStop(1, '#388e3c');
                }
                
                ctx.fillStyle = gradient;
                ctx.shadowColor = 'rgba(76, 175, 80, 0.5)';
                ctx.shadowBlur = 10;
                ctx.fillRect(segment.x, segment.y, GRID_SIZE - 2, GRID_SIZE - 2);
                ctx.shadowBlur = 0;
            });

            // Draw food with glow effect
            const foodGradient = ctx.createRadialGradient(
                food.x + GRID_SIZE/2, food.y + GRID_SIZE/2, 0,
                food.x + GRID_SIZE/2, food.y + GRID_SIZE/2, GRID_SIZE/2
            );
            foodGradient.addColorStop(0, '#ff6b6b');
            foodGradient.addColorStop(1, '#ff4757');
            
            ctx.fillStyle = foodGradient;
            ctx.shadowColor = 'rgba(255, 71, 87, 0.8)';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(food.x + GRID_SIZE/2, food.y + GRID_SIZE/2, GRID_SIZE/2 - 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
