const gameBoard = document.getElementById('gameBoard');
const messageDisplay = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const gameModeSelect = document.getElementById('gameMode');
const cells = document.querySelectorAll('.cell');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'player'; // 'player' or 'computer'

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// --- Game Logic Functions ---

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handlePlayerMove(clickedCell, clickedCellIndex);
    checkResult();

    if (gameActive && gameMode === 'computer' && currentPlayer === 'O') {
        setTimeout(handleComputerMove, 700); // Delay for better UX
    }
}

function handlePlayerMove(cell, index) {
    board[index] = currentPlayer;
    cell.innerHTML = currentPlayer;
    cell.setAttribute('data-player', currentPlayer); // <-- This line is crucial
    cell.classList.add('occupied');
}
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    messageDisplay.innerHTML = `${currentPlayer === 'X' ? 'Player X' : 'Player O'}'s Turn`;
}

function checkResult() {
    let roundWon = false;
    let winningLine = null; // Store the winning condition

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition; // Store the winning line
            break;
        }
    }

    if (roundWon) {
        messageDisplay.innerHTML = `${currentPlayer === 'X' ? 'Player X' : 'Player O'} Wins!`;
        gameActive = false;

        // --- HIGHLIGHT WINNING CELLS ---
        winningLine.forEach(index => {
            document.querySelector(`[data-cell-index="${index}"]`).classList.add('winning-cell');
        });
        // -------------------------------
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        messageDisplay.innerHTML = `It's a Draw!`;
        gameActive = false;
        return;
    }

    changePlayer();
}

function handleComputerMove() {
    let availableCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableCells.push(i);
        }
    }

    if (availableCells.length > 0) {
        // Simple AI: choose a random empty cell
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cellIndex = availableCells[randomIndex];
        const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);

        handlePlayerMove(cell, cellIndex);
        checkResult();
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    messageDisplay.innerHTML = `Player X's Turn`;

    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('occupied');
        // --- REMOVE WINNING CELL HIGHLIGHT ---
        cell.classList.remove('winning-cell');
        // ------------------------------------
        cell.removeAttribute('data-player'); // Good practice to clear this too
    });
}

// --- Event Listeners ---

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
gameModeSelect.addEventListener('change', (e) => {
    gameMode = e.target.value;
    resetGame();
});

// Initial setup
resetGame();