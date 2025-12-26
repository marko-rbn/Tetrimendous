
export default class Grid {

    buildTableGrid(blocksX, blocksY) {
        const table = document.getElementById('board-grid');
        for (let y = 0; y < blocksY; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < blocksX; x++) {
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

}
