/*----- game options -----*/ 
const twoPlayerModeBtn = document.getElementById('two-player-mode')
const threePlayerModeBtn = document.getElementById('three-player-mode')
const vsComputerModeBtn = document.getElementById('vs-computer')
const boardWidthInput = document.getElementById('board-width')
const boardHeightInput = document.getElementById('board-height')
const inARowToWinInput = document.getElementById('to-win')
/*----- constants -----*/ 
const gameBoard = []
let boardHeight, boardWidth, inARowToWin;


// Looking for a winner
let lookingFor, piecesInARow = null

/*----- app's state (variables) -----*/ 
/*----- cached element references -----*/ 
/*----- event listeners -----*/ 
boardWidthInput.addEventListener('change',function(e){
    boardWidth = parseInt(e.target.value)
})
boardHeightInput.addEventListener('change',function(e){
    boardHeight = parseInt(e.target.value)
})
inARowToWinInput.addEventListener('change',function(e){
    inARowToWin = parseInt(e.target.value)
})

/*----- functions -----*/

//don't let height or width be smaller than inARowToWin

// We only need to set up the rows. 
/// We can write directly to the squares when needed
function setUpBoardObject(){
    for (let row = 0; row < boardHeight; row++){
        gameBoard[row] = []
        // for (let col = 0; col < boardWidth; col++){
        //     gameBoard[row][col] = ""
        // }
    }
}

// Looking for a winner
// Looking in rows
function checkRowsForWinner(){
    for (let row = 0; row < boardHeight; row++){
        piecesInARow = 0
        for (let col = 0; col < boardWidth; col++){
            countPiecesInARow(gameBoard[row][col])
        }
        isThereAWinner()
    }
}

// Looking in cols
function checkColsForWinner(){
    for (let col = 0; col < boardWidth; col++){
        piecesInARow = 0
        for (let row = 0; row < boardHeight; row++){
            countPiecesInARow(gameBoard[row][col])
        }
    }
}


// Looking on south-east (\) diagonal
function checkSEDiagonalForWinner(){
    let diagonalsToCheck = ( boardHeight + boardWidth - 1 ) - (2*( inARowToWin - 1))
    console.log("diagonals to check", diagonalsToCheck)

    let rowStart = boardHeight - inARowToWin
    let colStart = 0
    let colsToGet = inARowToWin
    let colsToGetMax = boardWidth -1
    for (let i = 0; i < diagonalsToCheck; i++){
        console.log('outer loop ',i)
        let row = rowStart
        for(let col = colStart; col < colsToGet; col++){
            
            console.log('row',row,'col',col)
            // if (row > 0){ row-- }
            // else{
            //     console.log("row is at 0")
            //     colStart++
            // }
            row++
        }
        if (rowStart > 0){ 
            rowStart-- 
        }
        else{
            console.log('repeat 0')
            colStart++
        }
        if (colsToGet <= colsToGetMax) colsToGet++
    }
}

// this is a 5 tall 4 wide board
// 2.0 3.1 4.2           row-col = 2
// 1.0 2.1 3.2 4.3       row-col = 1
// 0.0 1.1 2.2 3.3      row-col = 0
// 0.1 1.2 2.3          row-col = -1


    // // start value
    // let row = boardHeight - inARowToWin
    // console.log(boardHeight, inARowToWin)
    // while (row >= 0){
    //     let colsToGet = inARowToWin
    //     while (colsToGet <= boardWidth){
    //         console.log(colsToGet)
    //         for (let col = 0; col < colsToGet; col++){
    //             console.log('row',row,'col',col)
    //         }
    //         colsToGet ++
    //     }
    //     // first loop is lenght of inArowtowin - start at 0
    //     // add 1 until length of board width - stay starting at 0
    //     // then we're at row zero on repeat and counting down cols from boardWidth until we get to inARowToWin agian
    //     // but at this point we start counting up our cols
       
    //     row--
    // }
// }

function countPiecesInARow(square){
    if (typeof square === "undefined"){
        piecesInARow = 1
    }
    else if (checkingFor !== square){
        checkingFor = square
        piecesInARow = 1
    }
    else if (square === checkingFor){
        piecesInARow++;
    }
}


function isThereAWinner(){
    if (count === toWin) winner = true
}

// let gameBoard =[
//     [],
//     [],
//     [],
//     []
// ]


/*

Logic for a win

 0|   0   1   2   3   4
 1|   0   1   2   3   4
 2|   0   1   2   3   4
 3|   0   1   2   3   4
 4|   0   1   2   3   4


check for 3 in a row. 
    let checkingFor, count = null


check for 3 in a col
    for each col

check for 3 /
check for 3 \


*/