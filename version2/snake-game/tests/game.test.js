import { Snake } from '../src/js/snake';
import { Food } from '../src/js/food';

describe('Snake Game', () => {
    let snake;
    let food;

    beforeEach(() => {
        snake = new Snake();
        food = new Food();
    });

    test('initial snake position', () => {
        expect(snake.body).toEqual([{ x: 0, y: 0 }]);
    });

    test('snake moves correctly', () => {
        snake.move('RIGHT');
        expect(snake.body[0]).toEqual({ x: 20, y: 0 });
    });

    test('snake grows when it eats food', () => {
        snake.grow();
        expect(snake.body.length).toBe(2);
    });

    test('food is generated in a valid position', () => {
        food.generateFood();
        const position = food.getPosition();
        expect(position.x).toBeGreaterThanOrEqual(0);
        expect(position.y).toBeGreaterThanOrEqual(0);
    });

    test('snake cannot move in the opposite direction', () => {
        snake.move('RIGHT');
        snake.move('LEFT');
        expect(snake.body[0]).toEqual({ x: 20, y: 0 });
    });
});