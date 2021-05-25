
/*----- constants -----*/ 
const gameBoard = [] 

/*----- app's state (variables) -----*/ 
// if tyding this up, maybe make all these  properties of a 'game' object
let boardHeight, 
    boardWidth, 
    inARowToWin, 
    numPlayers, 
    piecesInARow,
    winningMoves,
    currentMove,
    winner,
    players,
    whoseTurn, 
    checkingFor,
    moveCount

/*----- cached element references -----*/ 
const gameboardEl = document.getElementById("gameboard")
const messageBoardEl = document.getElementById("message-board")
/*----- game options -----*/ 
const optionsElem = document.getElementById('options')
const boardWidthInput = document.getElementById('board-width')
const boardHeightInput = document.getElementById('board-height')
const inARowToWinInput = document.getElementById('to-win')
const numPlayersInput = document.getElementById('players')
const newGameBtn = document.getElementById('new-game')

/*----- event listeners -----*/ 

newGameBtn.addEventListener('click',init)

gameboardEl.addEventListener('click',function(e){
    if(e.target.className == 'square'){
        clickOnBoard(e.target)
    }
});

optionsElem.addEventListener('change',function(e){
    if (e.target.nodeName === "INPUT"){
        enforceMinMaxInput(e.target)
    }
})

/*----- functions -----*/

function init(){
    // Set up variables
    boardHeight =  parseInt(boardHeightInput.value)
    boardWidth =  parseInt(boardWidthInput.value)
    inARowToWin =  parseInt(inARowToWinInput.value)
    numPlayers =  parseInt(numPlayersInput.value)
    piecesInARow = []
    winningMoves = []
    currentMove = false
    winner = false
    checkingFor = ""
    moveCount = 0
    
    setupPlayers()
    whoseTurn = 0
    
    setUpBoardObject()
    buildGameBoardElem()
    render()

}

/*----- functions - Render -----*/

function render(){
    if (currentMove){
        let square = document.getElementById("s-"+currentMove.row+"-"+currentMove.col)
        square.innerHTML = "<span>"+currentMove.player+"</span>"
        square.classList.add("full")
    }
    else{
        gameboardEl.classList.remove("winner")
    }
    
    if (winner){
        messageBoardEl.innerText = currentMove.player+" wins!"
        highlightWinner()
    }
    else if(outOfMoves()){
        messageBoardEl.innerText = "You're out of moves. No winner."
    }
    else{
        messageBoardEl.innerText = players[whoseTurn]+"'s turn."
        gameboardEl.style.setProperty('--player', "'"+players[whoseTurn]+"'")
    }

}

function highlightWinner(){
    for (let square of winningMoves){
        squareEl = document.getElementById("s-"+square.row+"-"+square.col)
        squareEl.classList.add("winner")
        gameboardEl.classList.add("winner")
    }
}
/*----- functions - setup stuff -----*/
//don't let height or width be smaller than inARowToWin - nice to have I guess... 

// We only need to set up the rows. 
/// We can write directly to the squares when needed
function setUpBoardObject(){
    for (let row = 0; row < boardHeight; row++){
        gameBoard[row] = []
    }
}

function buildGameBoardElem(){
    gameboardEl.innerHTML = ""
    for (let row = 0; row < boardHeight; row++){
        for (let col = 0; col < boardWidth; col++){
            let square = document.createElement("div")
            square.id = 's-'+row+"-"+col
            square.dataset.row = row
            square.dataset.col = col            
            square.className = 'square'
            square.style.width = 100/boardWidth + "%"
            square.style.paddingBottom = 100/boardWidth + "%"
            gameboardEl.appendChild(square)
        }
    }
    boardWidth > 10 ? gameboardEl.style.maxWidth = "100%" : gameboardEl.style.maxWidth = ""
    
}

function setupPlayers(){
    players = []
    let possiblePlayers = ["x","o","z","y","w","q","r","k"]
    for (let i = 0; i < numPlayers; i++ ){
        players.push(possiblePlayers[i])
    }
}

function enforceMinMaxInput(input){
    if (parseInt(input.value) > input.max){
        input.value = input.max
    }
    else if (parseInt(input.value) < input.min){
        input.value = input.min
    }
}

/*----- functions - Game play -----*/

function outOfMoves(){
    if (moveCount === boardHeight * boardWidth){
        return true
    }
    else{ moveCount++ }
}

function clickOnBoard(square){
    let row = square.dataset.row
    let col = square.dataset.col
    if (typeof gameBoard[row][col] === "undefined" && !winner){
        currentMove = {row: row, col: col, player:players[whoseTurn]}
        gameBoard[row][col] = players[whoseTurn]
        checkForWinner()
        nextPlayer()
        render()
    }
}

function nextPlayer(){
    if (whoseTurn < numPlayers - 1){
        whoseTurn++
    }
    else{
        whoseTurn = 0
    }
}


/*----- functions - Looking for a winner-----*/

function checkForWinner(){
    checkRowsForWinner()
    if (!winner){checkColsForWinner()}
    if (!winner){checkSouthEastDiagonalForWinner()}
    if (!winner){checkNorthWestDiagonalForWinner()}
}

// Looking in rows
function checkRowsForWinner(){
    for (let row = 0; row < boardHeight; row++){
        piecesInARow = []
        for (let col = 0; col < boardWidth; col++){
            countPiecesInARow(row, col)
            if (isThereAWinner() ) return
        }
    }
}

// Looking in cols
function checkColsForWinner(){
    for (let col = 0; col < boardWidth; col++){
        piecesInARow = []
        for (let row = 0; row < boardHeight; row++){
            countPiecesInARow(row, col)
            if (isThereAWinner() ) return
        }
    }
}

// Looking on south-east (\) diagonal
function checkSouthEastDiagonalForWinner(){
    
    let diagonalsToCheck = ( boardHeight + boardWidth - 1 ) - (2*( inARowToWin - 1))

    let rowStart = boardHeight - inARowToWin
    let colStart = 0
    let colsToGet = inARowToWin
    let colsToGetMax = boardWidth -1
    for (let i = 0; i < diagonalsToCheck; i++){
        piecesInARow = []
        let row = rowStart
        for(let col = colStart; col < colsToGet; col++){
            // console.log('row',row,'col',col)
            countPiecesInARow(row, col)
            if (isThereAWinner() ) return
            row++
        }
        if (rowStart > 0){ 
            rowStart-- 
        }
        else{
            // Moving along the top of the gird now 
            // we stay at row 0 and start moving across the cols
            colStart++
        }
        if (colsToGet <= colsToGetMax) colsToGet++
    }
}

// Looking on north-west (/) diagonal
function checkNorthWestDiagonalForWinner(){
    
    let diagonalsToCheck = ( boardHeight + boardWidth - 1 ) - (2*( inARowToWin - 1))

    let rowStart = inARowToWin - 1
    let colStart = 0
    let colsToGet = inARowToWin
    let colsToGetMax = boardWidth -1
    for (let i = 0; i < diagonalsToCheck; i++){
        piecesInARow = []
        let row = rowStart
        for(let col = colStart; col < colsToGet; col++){
            // console.log('row',row,'col',col)
            countPiecesInARow(row, col)
            if (isThereAWinner() ) return
            row--
        }
        if (rowStart < boardHeight - 1){ 
            rowStart++
        }
        else{
            // Moving along the bottom of the gird now 
            // we stay at last row and start moving across the cols
            colStart++
        }
        if (colsToGet <= colsToGetMax) colsToGet++
    }
}

function countPiecesInARow(row, col){
    let square = gameBoard[row][col]
    if (typeof square === "undefined"){
        piecesInARow = []
    }
    else if (checkingFor !== square){
        checkingFor = square
        piecesInARow = [{row:row, col:col, player:square}]
    }
    else if (square === checkingFor){
        piecesInARow.push({row:row, col:col, player:square})
    }
}


function isThereAWinner(){
    if (piecesInARow.length === inARowToWin) {
        winner = true 
        winningMoves = piecesInARow
        return true
    }
}

