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

  const resetGameboard = () => {
    gameboard.forEach((row) => {
      row.forEach((cell) => cell.resetValues());
    });
  };

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

  return {
    getBoardArray,
    changeMark,
    getBoard,
    getRow,
    getCol,
    resetGameboard,
  };
})();

//this function is called when the DOM is loaded and it creates the gameboard grid
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
document.addEventListener("DOMContentLoaded", () => {
  displayBoard();
});

function Cell() {
  let value = "";
  let callCount = 0;
  const changeValue = (playerMark) => {
    value = playerMark;
    callCount++;
  };
  const resetValues = () => {
    value = "";
    callCount = 0;
  };
  const incrementCallCount = () => callCount++;
  const getCallCount = () => callCount;
  const getValue = () => value;

  return {
    getValue,
    changeValue,
    incrementCallCount,
    getCallCount,
    resetValues,
  };
}

const GameController = (function () {
  let win = false;

  const displayWindow = document.querySelector(".display");
  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Game?";
  restartButton.id = "restart";
  restartButton.addEventListener("click", () => {
    restartGame();
  });

  function displayMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.marginBottom = ".05rem";
    displayWindow.appendChild(messageDiv);
  }

  displayMessage("Welcome!");
  displayMessage("To START the game, please enter your NAMES.");

  function Player(playerName, playerMark) {
    return { playerName, playerMark };
  }
  let players = [];
  let activePlayer;

  function prepareForGame(nameInput, playerIndex1, mark) {
    const wrapper = nameInput.parentElement;

    nameInput.addEventListener("change", (e) => {
      nameInput.value = e.target.value;

      players[playerIndex1] = Player(nameInput.value, mark);

      activePlayer = players[0];

      if (players[0] && players[1]) {
        displayWindow.innerHTML = "";
        displayMessage("Let's play!");
        displayMessage(`${activePlayer.playerName}'s turn!`);
      }
      if (nameInput.value.trim() !== "") {
        wrapper.classList.add("valid");
      } else {
        wrapper.classList.remove("valid");
      }
    });
  }

  let playerOneInput = document.querySelector("#player-one");
  let playerTwoInput = document.querySelector("#player-two");
  prepareForGame(playerOneInput, 0, "X");
  prepareForGame(playerTwoInput, 1, "O");

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
    if (!checkWinCondition()) {
      displayWindow.innerHTML = "";
      displayMessage(`${activePlayer.playerName}'s turn!`);
    }
  };

  const restartGame = () => {
    win = false;
    gameboard.resetGameboard();
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = "";
    displayBoard();
    activePlayer = players[0];
    displayWindow.innerHTML = "";
    displayMessage("Let's play!");
    displayMessage(`${activePlayer.playerName}'s turn!`);
  };

  function playRound(targetDiv) {
    let { row, col } = gridValues[targetDiv.value];
    //checks if the game is won => exits the func execution without any changes if it is won
    if (win) return;
    //checks if the user choose the cell that was already taken => exits the func execution without any changes if it is taken
    //otherwise it changes the cell value to the active player's mark and checks if the game is won
    //if the game is not won it changes the active player
    if (gameboard.getBoard()[row][col].getValue()) {
      if (gameboard.getBoard()[row][col].getCallCount() === 1) {
        displayMessage("the cell is already taken, choose another one");
        gameboard.getBoard()[row][col].incrementCallCount();
        return;
      } else return;
    } else {
      gameboard.changeMark(row, col, activePlayer.playerMark);
      targetDiv.textContent = activePlayer.playerMark;
      /* checkWinCondition(); */
      changeActivePlayer();
    }
  }

  const checkWinCondition = () => {
    let previousPlayer = activePlayer === players[0] ? players[1] : players[0];

    function declareWinner() {
      win = true;
      displayWindow.innerHTML = "";
      displayMessage(`Congratulations! ${previousPlayer.playerName} wins!`);
      displayWindow.appendChild(restartButton);
    }

    //this is an implicit return function (if there would be curly braces we would have to RETURN the result of the function)
    const allEqual = (arr, mark) => arr.every((val) => val === mark);
    //checking if the row consists of only active player's marks
    function checkRow(mark) {
      for (let row = 0; row < 3; row++) {
        if (allEqual(gameboard.getRow(row), mark)) {
          return true;
        }
      }
      return false;
    }

    //checking if the col consists of only active player's marks
    function checkCol(mark) {
      for (let col = 0; col < 3; col++) {
        if (allEqual(gameboard.getCol(col), mark)) {
          return true;
        }
      }
      return false;
    }

    //checking diagonal lines win condition
    let board = gameboard.getBoard();
    function checkDiagonal(mark) {
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
      return allEqual(diag1, mark) || allEqual(diag2, mark);
    }

    if (
      checkRow(previousPlayer.playerMark) ||
      checkCol(previousPlayer.playerMark) ||
      checkDiagonal(previousPlayer.playerMark)
    ) {
      declareWinner();
    }

    if (!win) {
      const isTie = board.every((row) =>
        row.every((cell) => Boolean(cell.getValue()))
      );
      if (isTie) {
        win = true;
        displayWindow.innerHTML = "";
        displayMessage("It's a tie!");
        displayWindow.appendChild(restartButton);
      }
    }
    return win;
  };

  return { playRound };
})();
