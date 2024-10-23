  // Initialize the chessboard with pieces
  let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

// Stack to track the move history
let moveStack = [];

let selectedPiece = null;
let currentTurn = 'white'; // white or black
let selectedSquare = null;

// Mapping of pieces to image paths
const pieceImages = {
    'P': 'images/white-pawn.png',
    'R': 'images/white-rook.png',
    'N': 'images/white-knight.png',
    'B': 'images/white-bishop.png',
    'Q': 'images/white-queen.png',
    'K': 'images/white-king.png',
    'p': 'images/black-pawn.png',
    'r': 'images/black-rook.png',
    'n': 'images/black-knight.png',
    'b': 'images/black-bishop.png',
    'q': 'images/black-queen.png',
    'k': 'images/black-king.png'
};

function updateTurnDisplay() {
    const turnDisplay = document.getElementById('turnDisplay');
    turnDisplay.textContent = currentTurn === 'white' ? "White's Turn" : "Black's Turn";
}

// Initialize the chessboard in the DOM
function initChessboard() {
    const chessboardElement = document.getElementById('chessboard');
    chessboardElement.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square', (row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            const piece = board[row][col];
            if (piece) {
                const pieceImg = document.createElement('img');
                pieceImg.src = pieceImages[piece];
                square.appendChild(pieceImg);
            }

            // Handle click event for selecting/moving pieces
            square.addEventListener('click', () => handleSquareClick(row, col));

            chessboardElement.appendChild(square);
        }
    }
    updateTurnDisplay();
}

// Handle the selection and movement of pieces
function handleSquareClick(row, col) {
    if (!selectedPiece) {
        // Select a piece
        if (board[row][col] && isCorrectTurn(board[row][col])) {
            selectedPiece = board[row][col];
            selectedSquare = { row, col };
            highlightSelectedSquare(row, col);
        }
    } else {
        // Move the piece
        if (isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
            movePiece(selectedSquare.row, selectedSquare.col, row, col);
        }
        selectedPiece = null;
        selectedSquare = null;
        clearHighlights();
    }
}

// Check if the piece belongs to the current player
function isCorrectTurn(piece) {
    return (currentTurn === 'white' && piece === piece.toUpperCase()) ||
           (currentTurn === 'black' && piece === piece.toLowerCase());
}

// Move the piece and update the board state
function movePiece(startRow, startCol, endRow, endCol) {
    const movedPiece = board[startRow][startCol];
    const capturedPiece = board[endRow][endCol];

    // Push the move onto the stack
    moveStack.push({ startRow, startCol, endRow, endCol, movedPiece, capturedPiece });

    // Move the piece on the board
    board[endRow][endCol] = movedPiece;
    board[startRow][startCol] = '';

    // Switch turns
    currentTurn = currentTurn === 'white' ? 'black' : 'white';

    // Re-render the board
    initChessboard();
}

// Undo the last move
document.getElementById('undoBtn').addEventListener('click', function(){
    if (moveStack.length === 0) return;

    const lastMove = moveStack.pop();
    const { startRow, startCol, endRow, endCol, movedPiece, capturedPiece } = lastMove;

    // Revert the move on the board
    board[startRow][startCol] = movedPiece;
    board[endRow][endCol] = capturedPiece;

    // Switch turns back
    currentTurn = currentTurn === 'white' ? 'black' : 'white';

    // Re-render the board
    initChessboard();
});

// Check if the move is valid (basic move check for now)
function isValidMove(startRow, startCol, endRow, endCol) {
    const piece = board[startRow][startCol];
    const targetPiece = board[endRow][endCol];

    // Prevent moving to a square with a piece of the same color
    if (targetPiece && isCorrectTurn(targetPiece)) {
        return false;
    }

    // Simple check for now (you can add piece-specific move validation)
    return true;
}

// Highlight the selected square
function highlightSelectedSquare(row, col) {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        const squareRow = square.dataset.row;
        const squareCol = square.dataset.col;
        if (parseInt(squareRow) === row && parseInt(squareCol) === col) {
            square.style.border = '2px solid red';
        }
    });
}

// Clear all highlights
function clearHighlights() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.style.border = '';
    });
}

// Initialize the game on load
initChessboard();