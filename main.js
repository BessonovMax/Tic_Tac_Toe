const gameboard = (function Gameboard() {
  const gameboard = [];
  const rows = 3;
  const cols = 3;

  //fill gameboard with Cells

  for (let i = 0; i < rows; i++) {
    gameboard[i] = [];
    for (let j = 0; j < cols; j++) {
      gameboard[i].push(Cell());
    }
  }

  const getBoard = () => gameboard;

  const getRow = (row) => {
    let boardRow = [];
    for (let i = 0; i < 3; i++) {
      boardRow.push(gameboard[row][i].getValue());
    }
    return boardRow;
  };

  const getCol = (col) => {
    let boardCol = [];
    for (let i = 0; i < 3; i++) {
      boardCol.push(gameboard[i][col].getValue());
    }
    return boardCol;
  };

  //this function changes the cell value to the active player's mark
  //it is used in the GameController module to change the cell value
  const changeMark = (row, col, playerMark, target) =>
    gameboard[row][col].changeValue(playerMark);

  //this function returns the gameboard array with all cell values
  //it is used to create the grid in the DOM
  const getBoardArray = () => {
    const boardWithCells = [];
    gameboard.forEach((row) =>
      row.forEach((cell) => boardWithCells.push(cell.getValue()))
    );
    return boardWithCells;
  };

  return { getBoardArray, changeMark, getBoard, getRow, getCol };
})();

//this function is called when the DOM is loaded and it creates the gameboard grid
document.addEventListener("DOMContentLoaded", () => {
  const displayBoard = () => {
    const grid = document.createElement("div");
    grid.className = "game";
    const gameContainer = document.querySelector(".game-container");
    const boardArr = gameboard.getBoardArray();

    for (let i = 0; i < boardArr.length; i++) {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.textContent = `${boardArr[i]}`;
      cellEl.value = i;
      cellEl.addEventListener("click", (e) => {
        GameController.playRound(e.target);
      });
      grid.appendChild(cellEl);
    }

    gameContainer.appendChild(grid);
  };

  displayBoard();
});

function Cell() {
  let value = "";

  const changeValue = (playerMark) => (value = playerMark);

  const getValue = () => value;

  return { getValue, changeValue };
}

const GameController = (function () {
  const displayWindow = document.querySelector(".display");

  function displayMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.marginBottom = ".05rem";
    displayWindow.appendChild(messageDiv);
  }

  displayMessage("Welcome to Tic Tac Toe!");
  displayMessage("To start the game, please enter your names.");

  function Player(playerName, playerMark) {
    return { playerName, playerMark };
  }
  let players = [];
  let activePlayer;

  let playerOneInput = document.querySelector("#player-one");
  let playerTwoInput = document.querySelector("#player-two");
  playerOneInput.addEventListener("change", (e) => {
    playerOneInput.value = e.target.value;
    players[0] = Player(playerOneInput.value, "X");
    activePlayer = players[0];
    if (players[1]) {
      displayWindow.innerHTML = "";
      displayMessage("Let's play!");
    }
  });
  playerTwoInput.addEventListener("change", (e) => {
    playerTwoInput.value = e.target.value;
    players[1] = Player(playerTwoInput.value, "O");
    if (players[0]) {
      displayWindow.innerHTML = "";
      displayMessage("Let's play!");
    }
  });

  //creates grid values object with row and col properties
  //this object is used to get the row and col of the cell that was clicked by the user
  const gridValues = {};
  for (let i = 0; i < 9; i++) {
    gridValues[i] = {};
    gridValues[i].row = Math.floor(i / 3);
    gridValues[i].col = i % 3;
  }

  const changeActivePlayer = () => {
    activePlayer === players[0]
      ? (activePlayer = players[1])
      : (activePlayer = players[0]);
  };
  function playRound(targetDiv) {
    let { row, col } = gridValues[targetDiv.value];

    //checks if the user choose the cell that was already taken => exits the func execution without any changes if it is taken
    //otherwise it changes the cell value to the active player's mark and checks if the game is won
    //if the game is not won it changes the active player
    if (gameboard.getBoard()[row][col].getValue()) {
      alert("the cell is already taken, choose another one");
      return;
    } else {
      gameboard.changeMark(row, col, activePlayer.playerMark);
      targetDiv.textContent = activePlayer.playerMark;
      checkWinCondition();
      changeActivePlayer();
    }
  }

  const checkWinCondition = () => {
    let board = gameboard.getBoard();
    let win = false;
    const diag1 = [
      board[0][0].getValue(),
      board[1][1].getValue(),
      board[2][2].getValue(),
    ];
    const diag2 = [
      board[0][2].getValue(),
      board[1][1].getValue(),
      board[2][0].getValue(),
    ];
    const winPattern = JSON.stringify([
      activePlayer.playerMark,
      activePlayer.playerMark,
      activePlayer.playerMark,
    ]);
    function declareWinner() {
      win = true;
      displayMessage(`${activePlayer.playerName} wins!`);
    }
    //this is an implicit return function (if there would be curly braces we would have to RETURN the result of the function)
    const allEqual = (arr, mark) => arr.every((val) => val === mark);
    //checking if the row consists of only active player's marks
    for (let row = 0; row < 3; row++) {
      if (allEqual(gameboard.getRow(row), activePlayer.playerMark)) {
        declareWinner();
      }
    }
    //checking if the col consists of only active player's marks
    for (let col = 0; col < 3; col++) {
      if (allEqual(gameboard.getCol(col), activePlayer.playerMark)) {
        declareWinner();
      }
    }
    //checking diagonal lines win condition
    if (
      JSON.stringify(diag1) === winPattern ||
      JSON.stringify(diag2) === winPattern
    ) {
      declareWinner();
    }

    if (!win) {
      const isTie = board.every((row) =>
        row.every((cell) => Boolean(cell.getValue()))
      );
      if (isTie) {
        win = true;
        displayMessage("It's a tie!");
      }
    }
    return;
  };

  return { playRound };
})();
