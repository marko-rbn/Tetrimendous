import Grid from './grid.js';
import { Shape, Direction } from './shape.js';

// initialize grid
const grid = new Grid(12, 20);
const shape = new Shape(grid);
shape.addNewShape();

// listen to keyboard events
document.addEventListener('keydown', (event) => {
    switch (event.key) {

        case 'ArrowLeft':
        case 'a':
            shape.move(Direction.Left);
            break;

        case 'ArrowRight':
        case 'd':
            shape.move(Direction.Right);
            break;

        case 'ArrowDown':
        case 's':
            shape.move(Direction.Down);
            break;

        case 'ArrowUp':
        case 'w':
        case ' ':
            shape.rotate();
            break;

    }
});
