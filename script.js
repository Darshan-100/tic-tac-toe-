let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "2p";

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const modeSelector = document.getElementById("mode");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

modeSelector.addEventListener("change", () => {
  gameMode = modeSelector.value;
  restartGame();
});

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] || !gameActive) return;

  makeMove(index, currentPlayer);
  clickSound.play();

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins! 🎉`;
    winSound.play();
    gameActive = false;
    return;
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    drawSound.play();
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (gameMode === "ai" && currentPlayer === "O") {
    setTimeout(() => {
      const aiMove = getBestMove();
      makeMove(aiMove, "O");
      clickSound.play();
      if (checkWinner("O")) {
        statusText.textContent = `AI wins! 🤖`;
        winSound.play();
        gameActive = false;
      } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a draw!";
        drawSound.play();
        gameActive = false;
      } else {
        currentPlayer = "X";
        statusText.textContent = "Player X's turn";
      }
    }, 300);
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add(player);
}

function checkWinner(player) {
  return winConditions.some(condition =>
    condition.every(index => board[index] === player)
  );
}

function restartGame() {
  board.fill("");
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
  });
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  const winner = checkMinimaxWinner(boardState);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (boardState.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = "";
      }
    }
    return best;
  }
}

function checkMinimaxWinner(boardState) {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }
  return null;
}
