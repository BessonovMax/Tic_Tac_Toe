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

  const changeMark = (row, col, playerMark) => {
    if (gameboard[row][col].getValue()) {
      alert("the cell is already taken, choose another one");
      return;
    } else gameboard[row][col].changeValue(playerMark);
  };

  const printBoard = () => {
    const boardWithCells = gameboard.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCells);
  };

  return { printBoard, changeMark, getBoard, getRow, getCol };
})();

function Cell() {
  let value = 0;

  const changeValue = (playerMark) => (value = playerMark);

  const getValue = () => value;

  return { getValue, changeValue };
}

const GameController = (function () {
  function Player(playerName, playerMark) {
    return { playerName, playerMark };
  }

  let players = [
    Player(prompt("Player One"), "X"),
    Player(prompt("Player Two"), "O"),
  ];

  let activePlayer = players[0];

  const changeActivePLayer = () => {
    activePlayer === players[0]
      ? (activePlayer = players[1])
      : (activePlayer = players[0]);
  };

  function playRound() {
    const getUserValues = (function () {
      let row = 0;
      let col = 0;
      //check user input for correct value
      row = prompt(`${activePlayer.playerName}, choose your row`);
      while (row < 1 || row > 3) {
        row = prompt(`${activePlayer.playerName} row must be from 1 to 3`);
      }
      col = prompt(`${activePlayer.playerName}, choose your column`);
      while (col < 1 || col > 3) {
        col = prompt(`${activePlayer.playerName} col must be from 1 to 3`);
      }
      return { row: row - 1, col: col - 1 };
    })();

    //checks if the user choose the cell that was already taken => exits the func execution without any changes if it is taken
    if (gameboard.getBoard()[getUserValues.row][getUserValues.col].getValue()) {
      alert("the cell is already taken, choose another one");
      return;
    } else {
      gameboard.changeMark(
        getUserValues.row,
        getUserValues.col,
        activePlayer.playerMark
      );
      changeActivePLayer();
    }
    gameboard.printBoard();
  }

  const checkWinCondition = () => {
    // checking the player whose turn just ended (because the change of active player happens before winning condition check) if he won he is declared as a winner
    let previosPlayer = activePlayer === players[0] ? players[1] : players[0];

    let board = gameboard.getBoard();
    let win = false;
    diag1 = [
      board[0][0].getValue(),
      board[1][1].getValue(),
      board[2][2].getValue(),
    ];
    diag2 = [
      board[0][2].getValue(),
      board[1][1].getValue(),
      board[2][0].getValue(),
    ];
    const winPattern = JSON.stringify([
      previosPlayer.playerMark,
      previosPlayer.playerMark,
      previosPlayer.playerMark,
    ]);
    function declareWinner() {
      win = true;
      console.log(`${previosPlayer.playerName} wins!`);
    }
    //this is an implicit return function (if there would be curly braces we would have to RETURN the result of the function)
    const allEqual = (arr, mark) => arr.every((val) => val === mark);
    //checking if the row consists of only active player's marks
    for (let row = 0; row < 3; row++) {
      if (allEqual(gameboard.getRow(row), previosPlayer.playerMark)) {
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
    return win;
  };

  const playGame = () => {
    let result = false;
    while (!result) {
      playRound();
      result = checkWinCondition();
    }
  };
  playGame();
})();
