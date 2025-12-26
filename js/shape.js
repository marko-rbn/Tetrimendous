export const Direction = Object.freeze({
    Up: 'U', Down: 'D', Left: 'L', Right: 'R'
})

export class Shape {
    // colors available in css
    #colors = ['red', 'blue', 'gray', 'green', 'yellow', 'orange', 'purple'];

    #timer = null;
    interval = 500; //ms
    #grid = null;

    originX = 0;
    originY = 0;
    color = null;

    //TODO:
    // shape color and type: [I, J, L, O, S, T, Z], color
    // array of block relative coordinates (4 items since each shape is made of 4 blocks): blocks[4] = [{x:0, y:0}, ...];
    // rotation logic (90 deg, check for collisions): rotate()

    constructor(gridInstance) {
        this.#grid = gridInstance;
    }

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
                if (newY > this.#grid.height - 1 || this.doesOverlap(this.originX, newY)) {
                    this.#grid.lockShape(this);
                    this.addNewShape();
                    return;
                }
                this.#grid.colorBlock(this.originX, this.originY, null);

                if (allTheWay) {
                    do {
                        this.originY++;
                    } while (this.doesOverlap(this.originX, this.originY) === false && this.originY <= this.#grid.height - 1);
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

    doesOverlap(x, y) {
        return this.#grid.gridArray[x][y] !== null;
    }
}
