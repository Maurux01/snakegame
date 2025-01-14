  // Previous JavaScript code remains the same, but with these enhancements:

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
