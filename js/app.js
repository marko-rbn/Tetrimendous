export default function app() {
    console.log("Welcome to Tetrimendous!");
    buildTableGrid(10, 20);
}

function buildTableGrid(blocksX, blocksY) {
    const table = document.getElementById('board-grid');
    for (let y = 0; y < blocksY; y++) {
        const row = document.createElement('tr');
        for (let x = 0; x < blocksX; x++) {
            const cell = document.createElement('td', { id: `cell-${x}-${y}` });
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}