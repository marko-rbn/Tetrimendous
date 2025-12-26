import Grid from './grid.js';
import Shape from './shape.js';

let blockX = 5;
let blockY = 0;

// initialize grid
const grid = new Grid();
const shape = new Shape();

grid.buildTableGrid(12, 20);

//TODO: setup drop timing

// demo blocks
grid.colorBlock(blockX, blockY, 'red')

// listen to keyboard events
document.addEventListener('keydown', (event) => {
    switch (event.key) {

        case 'ArrowLeft':
        case 'a':
            console.log('Move piece left');
            grid.colorBlock(blockX, blockY, null);
            blockX = blockX - 1;
            console.log(blockX);
            grid.colorBlock(blockX, blockY, 'red');
            break;

        // Svitlana - add cases for other arrow keys below(complete)
        case 'ArrowRight':
        case 'd':
            console.log('Move piece right');
             grid.colorBlock(blockX, blockY, null);
            blockX = blockX + 1;
            console.log(blockX);
            grid.colorBlock(blockX, blockY, 'red');
            break;

        case 'ArrowDown':
        case 's':
            console.log('Move piece down');
             grid.colorBlock(blockX, blockY, null);
            blockY = blockY + 2;
            console.log(blockX);
            grid.colorBlock(blockX, blockY, 'red');
            break;

        case 'ArrowUp':
        case 'w':
        case ' ':
            //TODO: can't rotate one block, so implement later
            console.log('Rotate piece');
            break;

    }
  });
  