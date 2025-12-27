export const Direction = Object.freeze({
    Up: 'U', Down: 'D', Left: 'L', Right: 'R'
})

export class Shape {
    #grid = null;  //local reference to grid instance

    // colors available in css
    #colors = ['red', 'blue', 'gray', 'green', 'yellow', 'orange', 'purple'];
    #shapeTypes = [
        [[0,0], [0,1], [0,2], [0,-1]],   //I
        [[0,0], [0,1], [-1,-1], [0,-1]], //J
        [[0,0], [0,1], [1,1], [0,-1]],   //L
        [[0,0], [1,0], [0,1], [1,1]],    //O - prevent rotation, to prevent position wobble
        [[0,0], [1,0], [0,1], [-1,1]],   //S
        [[0,0], [0,1], [1,0], [-1,0]],   //T
        [[0,0], [-1,0], [0,1], [1,1]]    //Z
    ];

    interval = 500; //ms - time between automatic downward moves, can be adjusted from outside
    #timer = null;

    //set at to random values when new shape is created
    originX = 0;
    originY = 0;
    color = null;
    #shapeBlocks = [];  //one of #shapeTypes

    //TODO:
    // array of block relative coordinates (4 items since each shape is made of 4 blocks): blocks[4] = [{x:0, y:0}, ...];
    // rotation logic (90 deg, check for collisions): rotate()

    constructor(gridInstance) {
        this.#grid = gridInstance;
    }

    // TODO: do not allow left or right edge spawn
    // TODO: generate an actual shape, not just one block
    addNewShape() {
        let r = Math.floor(Math.random() * this.#grid.width);
        this.originX = r;  // 0 .. #grid.width-1
        this.originY = 0;

        r = Math.floor(Math.random() * this.#colors.length);
        this.color = this.#colors[r];  //0 .. #colors.length-1

        this.#grid.colorBlock(this.originX, this.originY, this.color);

        if (this.#timer) {
            clearInterval(this.#timer);
        }
        this.#timer = setInterval(() => {
            this.move(Direction.Down, false);
        }, this.interval);
    }

    //TODO: redo for actual shapes, not just single block
    move(direction, allTheWay = true) {
        switch (direction) {
            case Direction.Left:
                if (this.originX === 0) {
                    return;
                }
                this.#grid.colorBlock(this.originX, this.originY, null);
                this.originX = this.originX - 1;
                this.#grid.colorBlock(this.originX, this.originY, this.color);
                break;

            case Direction.Right:
                if (this.originX === this.#grid.width - 1) {
                    return;
                }
                this.#grid.colorBlock(this.originX, this.originY, null);
                this.originX = this.originX + 1;
                this.#grid.colorBlock(this.originX, this.originY, this.color);
                break;

            case Direction.Down:
                const newY = this.originY + 1;
                if (newY > this.#grid.height - 1 || this.doesOverlapSingle(this.originX, newY)) {
                    this.#grid.lockShape(this);
                    this.addNewShape();
                    return;
                }
                this.#grid.colorBlock(this.originX, this.originY, null);

                if (allTheWay) {
                    do {
                        this.originY++;
                    } while (this.doesOverlapSingle(this.originX, this.originY) === false && this.originY <= this.#grid.height - 1);
                    this.originY--; // step back to last valid position
                    this.#grid.colorBlock(this.originX, this.originY, this.color);
                    this.#grid.lockShape(this);
                    this.addNewShape();               
                } else {
                    this.originY = newY;
                }

                this.#grid.colorBlock(this.originX, this.originY, this.color);

                break;
        }
    }

    rotate() {
        //rotate shape blocks 90 degrees right
        const newShapeBlocks = this.#shapeBlocks.map( ([x, y]) => {
            return [-y, x];
        });

        //check for collisions, update #shapeBlocks if possible
        if (!this.doesOverlap(newShapeBlocks)) {
            //this.redraw(this.#shapeBlocks, newShapeBlocks);
            this.#shapeBlocks = newShapeBlocks;
        }
    }

    //redraw shape in new position/orientation
    redraw(prevCoords, newCoords) {
        //TODO: erase previous
        //TODO: draw new
    }

    doesOverlap(blockCoords) {
        for (let block of blockCoords) {
            const absX = this.originX + block[0];
            const absY = this.originY + block[1];
            if (this.#grid.isOutOfBounds(absX, absY) || this.doesOverlapSingle(absX, absY)) {
                return true;
            }
        }
        return false;
    }

    //deprecated, move code to places of use
    doesOverlapSingle(x, y) {
        return this.#grid.gridArray[x][y] !== null;
    }
}
