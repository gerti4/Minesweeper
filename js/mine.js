'use strict'

var MINE_IMG = `<img class="mines" src="img/bomb.png">`;
var MINE = 'MINE'
var gFreeCells;
var gFreeSafeCells;

var gMines = [];



function createMine(minePos) {
    var mine = {
        location: { i: minePos.i, j: minePos.j },
        isExposed: false
    }
    return mine;

}


function createMines(size = 4,clickedRow,clickedCol) {   
    if(gMines.length!== 0 )  gMines = [];
    gFreeCells = getFreeCells(clickedRow,clickedCol);
    var minesInBoard = getLevel();
    for (var i = 0; i < minesInBoard.minesCount; i++) {
        var mine = createMine(gFreeCells[i])
        gMines.push(mine);
    }
}


function addMinesToBoard() {    
    for (var idx = 0; idx < gMines.length; idx++) {
        var currCell = gBoard[gMines[idx].location.i][gMines[idx].location.j];
        currCell.isMine = true;
    }
}


function setMinesNegsCount() {
    for (var i = 0; i < gMines.length; i++) {
        var mineCell = gMines[i].location;
        for (var row = mineCell.i - 1; row <= mineCell.i + 1; row++) {
            for (var col = mineCell.j - 1; col <= mineCell.j + 1; col++) {
                if (!isValidIdx(row, col) || (row === mineCell.i && col === mineCell.j)) {
                    continue;
                }
                gBoard[row][col].minesAroundCount++;
            }
        }
    }
}


function showMines(){
    for (var idx = 0; idx < gMines.length; idx++) {
        var currCell = gMines[idx].location;        
        var elMineCell = document.querySelector(`.cell${currCell.i}-${currCell.j}`);  
        elMineCell.classList.add('mine-expose');      
        elMineCell.innerHTML = MINE_IMG;
    }
}


function checkMineIsMarked(){
    for (var idx = 0; idx < gMines.length; idx++) {
        var currCell = gMines[idx].location;
        if(!gBoard[currCell.i][currCell.j].isMarked) return false;        
    }  
    return true;
}




function getFreeCells(row,col) {
    
    var cells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine && !(i === row && j === col)) {
                cells.push({ i: i, j: j });
            }
        }
    }
    cells = shuffle(cells)
    return cells;
}

function setMinesPos(i, j) {
    var pos = { i: i, j: j };
    for (var i = 0; i < gMines.length; i++) {
        if (gMines[i].location.i === pos.i && gMines[i].location.j === pos.j) return;
    }
    if (gMines.length < gMinesPositionCount) {
        gMines.push(createMine(pos));
        renderMinesPostion();
    }
    if (gMines.length === gMinesPositionCount) return true;
    else {
        return false;
    }
}

function getFreeSafeCells() {
    gFreeSafeCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine) gFreeSafeCells.push({ i: i, j: j });
        }
    }
    gFreeSafeCells = shuffle(gFreeSafeCells);
}
