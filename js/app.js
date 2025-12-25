import Grid from './grid.js';

export default function app() {
    const grid = new Grid();
    grid.buildTableGrid(12, 20);
    document.getElementById('cell-10-5').classList.add('red-block');
}
