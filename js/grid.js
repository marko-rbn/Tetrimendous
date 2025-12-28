export default class Grid {

    // grid dimensions
    width = 0;
    height = 0;
    gridArray = []; // null | color
    paused = false;

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
        const board = document.getElementById('board-grid');
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.id = `cell-${x}-${y}`;
                row.appendChild(cell);
            }
            board.appendChild(row);
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
        let minY = this.height, maxY = 0;

        for (let block of shape.shapeBlocks) {
            const absX = shape.originX + block[0];
            const absY = shape.originY + block[1];
            this.gridArray[absX][absY] = shape.color;
            //get min/max Y for completed line check
            if (absY < minY) minY = absY;
            if (absY > maxY) maxY = absY;
        }

        //clear filled rows
        for (let y = maxY; y >= minY; y--) {
            if (this.isFullRow(y)) {
                this.clearRow(y);
                y++; //recheck same row after clearing
            }
        }
    }

    //check if row is completely filled without gaps
    isFullRow(y) {
        for (let x = 0; x < this.width; x++) {
            if (this.gridArray[x][y] === null) {
                return false;
            }
        }
        return true;
    }

    //clear row visually and in gridArray
    clearRow(y) {
        this.togglePause(true, true); //internal call to avoid visual pause effect

        //set tr class to 'filled-row' for animation
        const row = document.getElementById(`board-grid`).rows[y];
        row.classList.add('filled-row');
        //shift grid down
        for (let clearY = y; clearY > 0; clearY--) {
            for (let x = 0; x < this.width; x++) {
                this.gridArray[x][clearY] = this.gridArray[x][clearY - 1];
            }
        }

        //redraw grid and remove 'filled-row' class giving time for animation
        setTimeout(() => {
            //redraw grid
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    this.colorBlock(x, y, this.gridArray[x][y]);
                }
            }
            row.classList.remove('filled-row');
            this.togglePause(false, true); //internal call to avoid visual pause effect
        }, 300); //match CSS animation duration     
    }

    isOutOfBounds(x, y) {
        return (x < 0 || x >= this.width || y >= this.height);  // y<0 is allowed (above the grid)
    }

    togglePause(pause = !this.paused, internalCall = false, className = 'paused') {
        this.paused = pause;
        if (internalCall) return;

        const board = document.getElementById('board-grid');
        if (pause) {
            board.classList.add(className);
        } else {
            board.className = '';
        }
    }

}
