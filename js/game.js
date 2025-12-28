import Grid from './grid.js';
import { Shape, Direction } from './shape.js';

export default class Game {
    #grid = null;
    #shape = null;
    #dropTimer = null;
    interval = 500; //ms
    gridWidth;
    gridHeight;
    #msgElement = null;
    #modalElement = null;

    //grid keeps the score and level

    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;

        // set up element references
        this.#msgElement = document.getElementById('game-msg');
        this.#modalElement = document.getElementById('modal-score');

        // initialize grid
        this.#grid = new Grid(this.gridWidth, this.gridHeight);
        this.#shape = new Shape(this.#grid);
        this.#shape.addNewShape();
        this.startAutoDrop();

        this.setupControls();

        //listen for game over event
        document.addEventListener('game-over', (event) => {
            clearInterval(this.#dropTimer);
            this.#msgElement.innerText = 'Game Over!';
            this.popModalWithScores();
        });

        //listen for level up event
        document.addEventListener('level-up', (event) => {
            //increase speed by 10% each level
            this.interval = Math.floor(this.interval * 0.9);
            this.startAutoDrop();
        });
    }

    reset() {
        this.#msgElement.innerText = '';
        this.#grid.reset();
        this.#shape.addNewShape();
        this.startAutoDrop();
    }

    //start automatic downward movement 
    startAutoDrop() {
        if (this.#dropTimer) {
            clearInterval(this.#dropTimer);
        }
        this.#dropTimer = setInterval(() => {
            this.#shape.move(Direction.Down, false);
        }, this.interval);
    }

    setupControls() {
        // listen to keyboard events
        document.addEventListener('keydown', (event) => {
            switch (event.key) {

                case 'ArrowLeft':
                case 'a':
                    this.#shape.move(Direction.Left);
                    break;

                case 'ArrowRight':
                case 'd':
                    this.#shape.move(Direction.Right);
                    break;

                case 'ArrowDown':
                case 's':
                    this.#shape.move(Direction.Down);
                    break;

                case 'ArrowUp':
                case 'w':
                case ' ':
                    this.#shape.rotate();
                    break;

                case 'p':
                    this.#grid.togglePause();
                    break;
            }
        });
    }

    loadHighScores() {
        return fetch('hi-scores.json')
            .then(response => response.json())
            .then(data => {
                console.log('High Scores:', data);
                return data;
            })
            .catch(error => {
                console.error('Error loading high scores:', error);
                return [];
            });
    }

    //highScores[] of {name: string, score: number, level: number, date: string}
    popModalWithScores() {
        const playerScore = this.#grid.currentScore;
        const playerLevel = this.#grid.currentLevel;

        const contentArea = this.#modalElement.querySelector('#scores-container');
        contentArea.innerHTML = ''; //clear previous content
        this.#modalElement.classList.add('active');

        // create a table for loading scores
        const table = document.createElement('table');
        table.id = 'high-scores-table';
        const headerRow = document.createElement('tr');
        ['Rank', 'Name', 'Score', 'Level', 'Date'].forEach(headerText => {
            const th = document.createElement('th');
            th.innerText = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        contentArea.appendChild(table);
        
        //load scores and populate table (including player's score after sorting)
        this.loadHighScores().then(highScores => {
            console.log('Loaded high scores:', highScores);
            //insert player's score
            const playerEntry = {
                name: 'Current Player',
                score: playerScore,
                level: playerLevel,
                date: new Date().toISOString().split('T')[0]
            };
            highScores.push(playerEntry);
            //sort descending by score
            highScores.sort((a, b) => b.score - a.score);
            //capture index of playerEntry
            let playerIndex = highScores.findIndex(entry => entry === playerEntry);

            //contentArea.innerHTML = `<h2>Your Score: ${playerScore} (Level ${playerLevel})</h2>`;
            for (let i = 0; i < highScores.length; i++) {
                const scoreEntry = highScores[i];
                const entryRow = document.createElement('tr');
                const rankCell = document.createElement('td');
                rankCell.innerText = (i + 1).toString();
                entryRow.appendChild(rankCell);

                const nameCell = document.createElement('td');
                nameCell.innerText = scoreEntry.name;
                entryRow.appendChild(nameCell);

                const scoreCell = document.createElement('td');
                scoreCell.innerText = scoreEntry.score.toString();
                entryRow.appendChild(scoreCell);

                const levelCell = document.createElement('td');
                levelCell.innerText = scoreEntry.level.toString();
                entryRow.appendChild(levelCell);

                const dateCell = document.createElement('td');
                dateCell.innerText = scoreEntry.date;
                entryRow.appendChild(dateCell);

                table.appendChild(entryRow);
            }

            //request name input if in top 10
            if (playerIndex >= 0 && playerIndex < 10) {
                const playerName = prompt('You made the high scores! Enter your name:', 'Anonymous');
                highScores[playerIndex].name = playerName || 'Anonymous';
            }

            //keep top 10 - for saving back later
            highScores = highScores.slice(0, 10);
            this.storeHighScoreEntry(highScores[playerIndex]);
        });



        //add restart button
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart Game';
        restartButton.addEventListener('click', () => {
            this.#modalElement.classList.remove('active');
            this.reset();
        });
        contentArea.appendChild(restartButton);
    }

    storeHighScoreEntry(newEntry) {
        console.log('Storing new high score entry:', newEntry);
        
        fetch('save-score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEntry)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score saved:', data);
        })
        .catch(error => {
            console.error('Error saving score:', error);
        });
    }
}
