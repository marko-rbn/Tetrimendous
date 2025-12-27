
export default class Grid {

    // grid dimensions
    width = 0;
    height = 0;
    gridArray = []; // null | color

    constructor(width, height) {
        this.width = width;
        this.height = height;

        //init grid array
        for (let x = 0; x < this.width; x++) {
            this.gridArray[x] = new Array(this.height).fill(null);
        }

        this.buildTableGrid();
    }

    buildTableGrid() {
        const table = document.getElementById('board-grid');
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.id = `cell-${x}-${y}`;
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    }

    colorBlock(x, y, blockColor = null) {
        const cell = document.getElementById(`cell-${x}-${y}`);
        if (cell) {
            if (blockColor) {
                cell.classList.add(blockColor + '-block');
            } else {
                cell.className = '';
            }
        }
    }

    lockShape(shape) {
        for (let block of shape.shapeBlocks) {
            const absX = shape.originX + block[0];
            const absY = shape.originY + block[1];
            this.gridArray[absX][absY] = shape.color;
        }
    }

    isOutOfBounds(x, y) {
        return (x < 0 || x >= this.width || y >= this.height);  // y<0 is allowed (above the grid)
    }
}
