'use strict'

const BEGINNER_BOARD = 4;
const MEDIUM_BOARD = 8;
const EXPERT_BOARD = 12;

const FLAG_IMG = `<img class="flag" src="img/flag.png">`;

// player life counter
var gLifeCount;

// if player wants to set mines menually for another player
var isManuallyPos = false;

// number of mines to position manually
var gMinesPositionCount;


var gFirstClick;
var gSafeClicks;

var gBoard;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    timePassed: '00:00:000'
};


var gLevels = [
    { level: 'Easy', number: BEGINNER_BOARD, minesCount: 2, record: 0 },
    { level: 'Medium', number: MEDIUM_BOARD, minesCount: 12, record: 0 },
    { level: 'Expert', number: EXPERT_BOARD, minesCount: 30, record: 0 }
];


// board contains a cell object with the given properties
function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
    }
    return cell;
}



function disableRightClickContext() {
    document.oncontextmenu = function () { return false; }
}


// build the model board according to the choosen size
function createBoard(size) {
    var matrix = [];
    for (var i = 0; i < size; i++) {
        matrix[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = createCell();
            matrix[i][j] = cell;
        }
    }
    return matrix;
}


function renderBoard(boardSize) {
    var strHTML = '<table align="center">\n\t<tbody>\n';
    for (var i = 0; i < boardSize; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < boardSize; j++) {
            strHTML += `<td class="cell cell${i}-${j}" oncontextmenu="markCell(${i},${j})"
             onclick="showContent(${i},${j})">`;
            strHTML += `</td>`;
        }
        strHTML += '</tr>\n';
    }
    strHTML += '</tbody>\n</table>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


// render levels button in top of the browser
function renderButtons() {
    var strHTML = '';
    for (var i = 0; i < gLevels.length; i++) {
        strHTML += `<button onclick="restart(${gLevels[i].number})">`;
        strHTML += gLevels[i].level;
        strHTML += `</button> `;
    }
    var elLevels = document.querySelector('.levels');
    elLevels.innerHTML = strHTML;
}



function init(size = BEGINNER_BOARD) {
    gFirstClick = false;
    gSafeClicks = 3;
    gLifeCount = 3;
    gMinesPositionCount = 0;
    gHintsCount = 3;
    disableRightClickContext();
    checkLocalStorage();
    gBoard = createBoard(size);
    renderButtons();
    renderHeading();
    renderBoard(gBoard.length);
    renderSafeClick();
    renderRecordLevel();
    renderManualMinesPosition();
    renderTime();
    gGame.isOn = true;
}


function showContent(i, j) {
    if (!gGame.isOn || isStillHint) return;
    if (isManuallyPos) {
        if (setMinesPos(i, j)) {
            addMinesToBoard();
            setMinesNegsCount();
            getFreeSafeCells();
            isManuallyPos = false;
        }
        return;
    }
    if (!gFirstClick) {
        gFirstClick = true;
        if (gMinesPositionCount) {
            startTime();
        }
        else {
            createMines(gBoard.length, i, j);
            addMinesToBoard();
            setMinesNegsCount();
            getFreeSafeCells();
            startTime();
        }
    }
    if (gBoard[i][j].isMarked) return;
    if (isAskedForHint) {
        hint(i, j);
        isAskedForHint = false;
        isStillHint = true;
        setTimeout(hint, 1000, i, j);
        return;
    }
    var elTdCell = document.querySelector(`.cell${i}-${j}`);
    var content = (gBoard[i][j].isMine) ? MINE_IMG : gBoard[i][j].minesAroundCount;
    if (content === MINE_IMG) {
        gLifeCount--;
        if (!gLifeCount) {
            showMines();
            lostLife();
            lostTheGame();
            gGame.isOn = false;
            clearInterval(gGameInterval);
            return;
        }
        lostLife();
        return;
    }
    if (content === 0) {
        showNegs(i, j, false);
    }
    gBoard[i][j].isShown = true;
    elTdCell.classList.add('shown')
    if (content === 0) elTdCell.innerHTML = '';
    else elTdCell.innerHTML = content;
    checkVictory();
}


function markCell(i, j) {
    if (!gGame.isOn || isStillHint || isManuallyPos ||gBoard[i][j].isShown) return;
    var elTdCell = document.querySelector(`.cell${i}-${j}`);
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    if (gBoard[i][j].isMarked) {
        elTdCell.innerHTML = FLAG_IMG;
        gGame.markedCount++;
    }
    else {
        elTdCell.innerHTML = '';
        gGame.markedCount--;
    }
    if (!gFirstClick) {
        startTime();
        return;
    }
    if (checkVictory()) {
        gGame.isOn = false;
        clearInterval(gGameInterval);
    }
}



function checkVictory() {
    if (checkMineIsMarked()) {
        if (checkAllCellShown()) {
            checkBestTime();
            wonTheGame();
            gGame.isOn = false;
        }
    }
}


function checkAllCellShown() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) return false;
        }
    }
    return true;
}



function showNegs(row, col, isNumber) {
    if (!isValidIdx(row, col) || isNumber || gBoard[row][col].isShown) {
        return;
    }
    var elTdCell = document.querySelector(`.cell${row}-${col}`);
    gBoard[row][col].isShown = true;
    var isNumber = gBoard[row][col].minesAroundCount;
    elTdCell.classList.add('shown');
    if (!isNumber) elTdCell.innerHTML = '';
    else elTdCell.innerHTML = isNumber;
    showNegs(row - 1, col - 1, isNumber);
    showNegs(row - 1, col, isNumber);
    showNegs(row - 1, col + 1, isNumber);
    showNegs(row, col - 1, isNumber);
    showNegs(row, col + 1, isNumber);
    showNegs(row + 1, col - 1, isNumber);
    showNegs(row + 1, col, isNumber);
    showNegs(row + 1, col + 1, isNumber);
}


function manualPos() {
    if (gFirstClick) return;
    isManuallyPos = true;
    var level = getLevel();
    gMinesPositionCount = level.minesCount;
    if (gMines.length !== 0) gMines = [];
    renderMinesPostion();
}




