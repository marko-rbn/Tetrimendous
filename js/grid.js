export default class Grid {
    #board = null;  //local reference to board container (table element)
    width;
    height;
    gridArray = []; // null | color
    paused = false;
    ended = false;
    #scoreElement = null;  //reference to score display element
    #levelElement = null;  //reference to level display element
    currentScore = 0;
    currentLevel = 1;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.#board = document.getElementById('board-grid');
        this.#levelElement = document.getElementById('level-value');
        this.#scoreElement = document.getElementById('score-value');

        //init grid array
        for (let x = 0; x < this.width; x++) {
            this.gridArray[x] = new Array(this.height).fill(null);
        }

        this.buildTableGrid();
    }

    reset() {
        //clear grid array
        for (let x = 0; x < this.width; x++) {
            this.gridArray[x].fill(null);
        }
        //clear visual grid
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.colorBlock(x, y, null);
            }
        }
        //reset states
        this.paused = false;
        this.ended = false;
        this.#board.className = '';
        this.currentLevel = 1;
        if (this.#levelElement) {
            this.#levelElement.innerText = this.currentLevel.toString();
        }
        this.currentScore = 0;
        if (this.#scoreElement) {
            this.#scoreElement.innerText = this.currentScore.toString();
        }
    }

    buildTableGrid() {
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.id = `cell-${x}-${y}`;
                row.appendChild(cell);
            }
            this.#board.appendChild(row);
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
        const row = this.#board.rows[y];
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
        
        updateScore(y)
    }

    updateScore(clearedRowY) {
        // TODO: incorporate level multipliers
        //update score based on height of cleared row
        let heightFactor = 1 - (clearedRowY / this.height);
        if (heightFactor < 0.2) {
            this.currentScore += 100 + (10 * this.level); //bottom 20%
        } else if (heightFactor < 0.5) {
            this.currentScore += 75 + (10 * this.level); //middle 30%
        } else {
            this.currentScore += 50 + (10 * this.level); //top 50%
        }

        if (this.#scoreElement) {
            this.#scoreElement.innerText = this.currentScore.toString();
        }

        //increase level every 500 points
        const newLevel = Math.floor(this.currentScore / 500) + 1;
        if (newLevel > this.currentLevel) {
            this.currentLevel = newLevel;
            if (this.#levelElement) {
                this.#levelElement.innerText = this.currentLevel.toString();
            }
            //dispatch level up event
            const levelUpEvent = new CustomEvent('level-up', { detail: { level: this.currentLevel } });
            document.dispatchEvent(levelUpEvent);
        }
    }

    isOutOfBounds(x, y) {
        return (x < 0 || x >= this.width || y >= this.height);  // y<0 is allowed (above the grid)
    }

    togglePause(pause = !this.paused, internalCall = false, className = 'paused') {
        this.paused = pause;
        if (className == 'ended') { 
            this.ended = true;
            //dispatch ended state event
            const gameOverEvent = new CustomEvent('game-over', { detail: { } });
            document.dispatchEvent(gameOverEvent);
        }
        if (internalCall) return;

        const board = document.getElementById('board-grid');
        if (pause) {
            board.classList.add(className);
        } else {
            board.className = '';
        }
    }

}
