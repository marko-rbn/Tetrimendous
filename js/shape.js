export const Direction = Object.freeze({
    Up: 'U', Down: 'D', Left: 'L', Right: 'R'
})

export class Shape {
    #grid = null;  //local reference to grid instance

    // colors available in css
    #colors = ['red', 'blue', 'gray', 'green', 'yellow', 'orange', 'purple'];
    #shapeTypes = [
        [[0,0], [1,0], [0,1], [1,1]],    //O - prevent rotation, to prevent position wobble
        [[0,0], [0,1], [0,2], [0,-1]],   //I
        [[0,0], [0,1], [-1,-1], [0,-1]], //J
        [[0,0], [0,1], [1,1], [0,-1]],   //L
        [[0,0], [1,0], [0,1], [-1,1]],   //S
        [[0,0], [0,1], [1,0], [-1,0]],   //T
        [[0,0], [-1,0], [0,1], [1,1]]    //Z
    ];

    //set at to random values when new shape is created
    originX = 0;
    originY = 0;
    color = null;
    #preventRotation = false;
    shapeBlocks = [];  //one of #shapeTypes

    constructor(gridInstance) {
        this.#grid = gridInstance;
    }

    addNewShape() {
        //set up random shape/location/color
        let r = Math.floor(Math.random() * 7);
        this.#preventRotation = (r === 0);
        this.shapeBlocks = this.#shapeTypes[r];
        r = Math.floor(Math.random() * (this.#grid.width - 2)) + 1;  // prevent edge spawn
        this.originX = r;
        this.originY = 1;
        r = Math.floor(Math.random() * this.#colors.length);
        this.color = this.#colors[r];

        //check for game over condition here
        if (this.doesOverlap(this.shapeBlocks)) {
            this.#grid.togglePause(true, false, 'ended');
            return;
        }

        //draw initial shape
        this.redraw([], this.shapeBlocks);
    }

    move(direction, allTheWay = true) {
        if (this.#grid.paused) return;
        
        let newX, newY;
        switch (direction) {
            //left/right combined to avoid code repetition
            case Direction.Left:
            case Direction.Right:
                newX = this.originX;
                newX = (direction == Direction.Left) ? newX - 1 : newX + 1;
                if (this.doesOverlap(this.shapeBlocks, newX, this.originY)) {
                    return;
                }
                this.redraw(this.shapeBlocks, this.shapeBlocks, newX, this.originY);
                this.originX = newX;
                break;

            case Direction.Down:
                newY = this.originY + 1;
                if (this.doesOverlap(this.shapeBlocks, this.originX, newY)) {
                    this.#grid.lockShape(this);
                    this.addNewShape();
                    return;
                }

                if (allTheWay) {
                    newY = this.originY;
                    do {
                        newY++;
                    } while (this.doesOverlap(this.shapeBlocks, this.originX, newY) === false);
                    newY--; // step back to last valid position

                    this.redraw(this.shapeBlocks, this.shapeBlocks, this.originX, newY);
                    this.originY = newY;
                    this.#grid.lockShape(this);
                    this.addNewShape();
                    return;             
                }

                this.redraw(this.shapeBlocks, this.shapeBlocks, this.originX, newY);
                this.originY = newY;

                break;
        }
    }

    rotate() {
        if (this.#preventRotation || this.#grid.paused) return;

        //rotate shape blocks 90 degrees right
        const newShapeBlocks = this.shapeBlocks.map( ([x, y]) => {
            return [-y, x];
        });

        //check for collisions, update #shapeBlocks if possible
        if (!this.doesOverlap(newShapeBlocks)) {
            this.redraw(this.shapeBlocks, newShapeBlocks);
            this.shapeBlocks = newShapeBlocks;
        }
    }

    //redraw shape in new position/orientation
    redraw(prevCoords, newCoords, newOriginX = this.originX, newOriginY = this.originY) {
        //erase previous
        for (let block of prevCoords) {
            const absX = this.originX + block[0];
            const absY = this.originY + block[1];
            this.#grid.colorBlock(absX, absY, null);
        }
        //draw new
        for (let block of newCoords) {
            const absX = newOriginX + block[0];
            const absY = newOriginY + block[1];
            this.#grid.colorBlock(absX, absY, this.color);
        }
    }

    doesOverlap(blockCoords, newOriginX = this.originX, newOriginY = this.originY) {
        for (let block of blockCoords) {
            const absX = newOriginX + block[0];
            const absY = newOriginY + block[1];
            if (this.#grid.isOutOfBounds(absX, absY) || this.#grid.gridArray[absX][absY] !== null) {
                return true;
            }
        }
        return false;
    }

}
