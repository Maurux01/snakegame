 const canvas = document.getElementById('gameBoard');
        const ctx = canvas.getContext('2d');
        const GRID_SIZE = 20;
        const GAME_SIZE = 400;
        
        canvas.width = GAME_SIZE;
        canvas.height = GAME_SIZE;

        let snake = [];
        let food = {};
        let direction = 'right';
        let nextDirection = 'right';
        let score = 0;
        let gameLoop;
        let isPaused = false;
        let gameSpeed = 100;

        function startGame() {
            // Reset game state
            snake = [
                {x: 60, y: 200},
                {x: 40, y: 200},
                {x: 20, y: 200},
            ];
            direction = 'right';
            nextDirection = 'right';
            score = 0;
            document.getElementById('score').textContent = score;
            document.getElementById('gameOver').style.display = 'none';
            createFood();
            
            if (gameLoop) clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, gameSpeed);
            isPaused = false;
        }

        function createFood() {
            food = {
                x: Math.floor(Math.random() * (GAME_SIZE / GRID_SIZE)) * GRID_SIZE,
                y: Math.floor(Math.random() * (GAME_SIZE / GRID_SIZE)) * GRID_SIZE
            };
            
            // Make sure food doesn't appear on snake
            for (let segment of snake) {
                if (segment.x === food.x && segment.y === food.y) {
                    createFood();
                    break;
                }
            }
        }

        function gameStep() {
            if (isPaused) return;

            // Update direction
            direction = nextDirection;

            // Calculate new head position
            const head = {x: snake[0].x, y: snake[0].y};
            switch(direction) {
                case 'up': head.y -= GRID_SIZE; break;
                case 'down': head.y += GRID_SIZE; break;
                case 'left': head.x -= GRID_SIZE; break;
                case 'right': head.x += GRID_SIZE; break;
            }

            // Check for collisions
            if (head.x < 0 || head.x >= GAME_SIZE ||
                head.y < 0 || head.y >= GAME_SIZE ||
                checkCollision(head)) {
                gameOver();
                return;
            }

            // Add new head
            snake.unshift(head);

            // Check if food was eaten
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                document.getElementById('score').textContent = score;
                createFood();
            } else {
                snake.pop();
            }

            // Draw everything
            draw();
        }

        function draw() {
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);

            // Draw snake
            ctx.fillStyle = '#4CAF50';
            snake.forEach((segment, index) => {
                if (index === 0) {
                    ctx.fillStyle = '#45a049'; // Different color for head
                } else {
                    ctx.fillStyle = '#4CAF50';
                }
                ctx.fillRect(segment.x, segment.y, GRID_SIZE - 2, GRID_SIZE - 2);
            });

            // Draw food
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(food.x, food.y, GRID_SIZE - 2, GRID_SIZE - 2);
        }

        function checkCollision(position) {
            return snake.some(segment => segment.x === position.x && segment.y === position.y);
        }

        function gameOver() {
            clearInterval(gameLoop);
            document.getElementById('finalScore').textContent = score;
            document.getElementById('gameOver').style.display = 'block';
        }

        function togglePause() {
            isPaused = !isPaused;
        }

        // Handle keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (direction !== 'down') nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (direction !== 'up') nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (direction !== 'right') nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (direction !== 'left') nextDirection = 'right';
                    break;
                case ' ':
                    togglePause();
                    break;
            }
        });

        // Start the game initially
        startGame();
