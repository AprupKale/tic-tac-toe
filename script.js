const gameBoard = (function () {
    let _status = 'Playing';
    let _board = [[null, null, null],
    [null, null, null],
    [null, null, null]];

    const markPosition = function (row, col, player) {
        if (_board[row - 1][col - 1] === null && _status === 'Playing') {
            _board[row - 1][col - 1] = player.getMark();
        } else return false;
        if (checkWin()) {
            _status = player.getMark() + ' wins';
        } else if (checkTie()) {
            _status = 'Tie';
        }
        return true;
    }

    const checkWin = function () {
        return checkRow() || checkCol() || checkDiag();
    }

    const checkRow = function () {
        for (let i = 0; i < 3; i++) {
            if (_board[i][0] === _board[i][1] && _board[i][1] === _board[i][2] && _board[i][2] !== null) return true;
        }
        return false;
    }

    const checkCol = function () {
        for (let i = 0; i < 3; i++) {
            if (_board[0][i] === _board[1][i] && _board[1][i] === _board[2][i] && _board[2][i] !== null) return true;
        }
        return false;
    }

    const checkDiag = function () {
        if (_board[0][0] == _board[1][1] && _board[1][1] == _board[2][2] && _board[2][2] !== null) return true;
        else if (_board[0][2] == _board[1][1] && _board[1][1] == _board[2][0] && _board[2][0] !== null) return true;
        else return false;
    }

    const checkTie = function () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (_board[i][j] === null) return false;
            }
        }
        return true;
    }

    const reset = function () {
        _status = 'Playing';
        _board = [[null, null, null],
        [null, null, null],
        [null, null, null]];
    }

    const getStatus = function () {
        return _status;
    }

    const getBoard = function () {
        return _board;
    }

    return { markPosition, getStatus, getBoard, reset };
})();

const displayController = (function () {
    const update = function () {
        const board = gameBoard.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const grid = document.querySelector(`#row-${i + 1}-col-${j + 1}`);
                grid.innerHTML = '';
                const mark = document.createElement('p');
                if (board[i][j] !== null) {
                    mark.textContent = board[i][j];
                } else {
                    mark.textContent = '';
                }
                grid.appendChild(mark);
            }
        }

        const turnIndicator = document.querySelector('#turn');
        turnIndicator.textContent = 'Turn to play : ' + game.getCurrentPlayer().getMark();

        if (gameBoard.getStatus() === 'X wins'
            || gameBoard.getStatus() === 'O wins'
            || gameBoard.getStatus() === 'Tie') {

            const display = document.querySelector('.display');
            const resetBottom = document.querySelector('#reset');
            display.removeChild(resetBottom);

            const resetTop = document.createElement('button');
            resetTop.textContent = 'Click here to reset';
            resetTop.id = 'reset';
            const heading = document.querySelector('.heading');
            display.removeChild(heading);
            display.insertBefore(resetTop, display.firstChild);
            
            const result = document.createElement('div');
            result.classList = 'result';
            const resultHeading = document.createElement('h1');
            if (resultHeading.textContent === playerOne.getMark() + ' wins') 
                resultHeading.textContent = playerOne.getName() + ' wins';
            else if (resultHeading.textContent === playerTwo.getMark() + ' wins') 
                resultHeading.textContent = playerTwo.getName() + ' wins';
            else resultHeading.textContent = 'Tie';
            display.appendChild(result);
            result.appendChild(resultHeading);
            
            reset.addEventListener('click', () => {
                display.removeChild(resetTop);
                display.removeChild(result);
                display.insertBefore(heading, display.firstChild);
                display.appendChild(resetBottom);
                game.reset();
            });
        }
    }

    return { update };
})();

const player = function (mark) {
    let _mark = mark;
    let _name = '';

    const move = function (row, col) {
        return gameBoard.markPosition(row, col, this);
    }

    const getMark = function () {
        return _mark;
    }

    const getName = function () {
        return _name === ''
            ? _mark
            : _name;
    }

    const setName = function (name) {
        _name = name;
    }

    return { move, getMark, setName, getName };
}

const playerOne = player('X');
const playerTwo = player('O');

const game = (function () {
    let _currentPlayer = playerOne;

    const play = function () {
        document
            .querySelector('#reset')
            .addEventListener('click', () => game.reset())
        
        document
            .querySelector('#playerOne')
            .addEventListener('change', e => playerOne.setName(e.target.value));

        document
            .querySelector('#playerTwo')
            .addEventListener('change', e => playerTwo.setName(e.target.value));

        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                let grid = document.querySelector(`#row-${i}-col-${j}`);
                grid.addEventListener('click', () => {
                    if (_currentPlayer.move(i, j)) {
                        _currentPlayer = _currentPlayer === playerOne
                            ? playerTwo
                            : playerOne;
                        displayController.update();
                    }
                });
            }
        }
    }

    const reset = function () {
        _currentPlayer = playerOne;
        document.querySelector('#playerOne').value = '';
        document.querySelector('#playerTwo').value = '';
        gameBoard.reset();
        displayController.update();
    }

    const getCurrentPlayer = function () {
        return _currentPlayer;
    }

    return { play, getCurrentPlayer, reset };
})();

game.play();