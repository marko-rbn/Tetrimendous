import Grid from './grid.js';

export default function app() {
    const grid = new Grid();
    grid.buildTableGrid(12, 20);
    document.getElementById('cell-10-5').classList.add('red-block');
    document.getElementById('cell-10-6').classList.add('red-block');
    document.getElementById('cell-9-5').classList.add('red-block');
    document.getElementById('cell-9-6').classList.add('red-block');

    document.getElementById('cell-1-12').classList.add('green-block');
    document.getElementById('cell-2-12').classList.add('green-block');
    document.getElementById('cell-1-13').classList.add('green-block');
    document.getElementById('cell-2-13').classList.add('green-block');

}