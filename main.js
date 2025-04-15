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

  const changeMark = (row, col, playerMark) =>
    gameboard[row][col].changeValue(playerMark);

  const printBoard = () => {
    const boardWithCells = gameboard.map((row) =>
      row.map((cell) => cell.getValue())
    );
    boardWithCells.forEach((row) => console.log(row.join(" | ")));
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

  const changeActivePlayer = () => {
    activePlayer === players[0]
      ? (activePlayer = players[1])
      : (activePlayer = players[0]);
  };

  function playRound() {
    function getUserValues() {
      //check user input for correct value
      let row = prompt(`${activePlayer.playerName}, choose your row`);

      while (row < 1 || row > 3) {
        row = prompt(`${activePlayer.playerName}, row must be from 1 to 3`);
        if (row == null) return;
      }
      let col = prompt(`${activePlayer.playerName}, choose your column`);

      while (col < 1 || col > 3) {
        col = prompt(`${activePlayer.playerName}, col must be from 1 to 3`);
        if (col == null) return;
      }
      return { row: row - 1, col: col - 1 };
    }

    let { row, col } = getUserValues();

    //checks if the user choose the cell that was already taken => exits the func execution without any changes if it is taken
    if (gameboard.getBoard()[row][col].getValue()) {
      alert("the cell is already taken, choose another one");
      return;
    } else {
      gameboard.changeMark(row, col, activePlayer.playerMark);
      changeActivePlayer();
    }
    gameboard.printBoard();
  }

  const checkWinCondition = () => {
    // checking the player whose turn just ended (because the change of active player happens before winning condition check) if he won he is declared as a winner
    let previousPlayer = activePlayer === players[0] ? players[1] : players[0];

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
      previousPlayer.playerMark,
      previousPlayer.playerMark,
      previousPlayer.playerMark,
    ]);
    function declareWinner() {
      win = true;
      console.log(`${previousPlayer.playerName} wins!`);
    }
    //this is an implicit return function (if there would be curly braces we would have to RETURN the result of the function)
    const allEqual = (arr, mark) => arr.every((val) => val === mark);
    //checking if the row consists of only active player's marks
    for (let row = 0; row < 3; row++) {
      if (allEqual(gameboard.getRow(row), previousPlayer.playerMark)) {
        declareWinner();
      }
    }
    //checking if the col consists of only active player's marks
    for (let col = 0; col < 3; col++) {
      if (allEqual(gameboard.getCol(col), previousPlayer.playerMark)) {
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
        console.log("It's a tie! Try one more time!");
      }
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
