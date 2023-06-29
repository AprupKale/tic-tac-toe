const gameBoard = (function () {
    let _board = [[null, null, null],
                [null, null, null],
                [null, null, null]];   
                
    return {_board};
})();

const displayController = (function () {
    const update = function () {
        
    }

    return {update};
})();

const player = function(mark) {
    let _mark = mark;
}

const playerOne = player('X');
const playerTWo = player('O');