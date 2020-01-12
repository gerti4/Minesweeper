'use strict'

const SMILEY = '<img class="smiley" src="img/smiley.png">';
const SAD = '<img class="smiley" src = "img/sad.png">';
const WINNER = '<img class="smiley" src = "img/winner.png">';

// indicating to the user that he clicked a mine
const audioLost = new Audio('sound/hit.wav');
const audioWon = new Audio('sound/victory.wav');

const MAX_TIME = '99:99:999';

var isAskedForHint;
var isStillHint;
var gHintsCount;

function checkLocalStorage() {
    if (!localStorage.getItem('Easy')) {
        localStorage.setItem('Easy', MAX_TIME);
        localStorage.setItem('Medium', MAX_TIME);
        localStorage.setItem('Expert', MAX_TIME);
    }
}




function renderHeading() {
    var strHTML = '<table align="center" class="info"><tbody>';
    strHTML += `<td class="hint" onclick="giveHint(this)">Hints: ${gHintsCount}</td>`;
    strHTML += `<td class="smiley" onclick="restart(${gBoard.length})">${SMILEY}</td>`;
    strHTML += `<td class="life">Life: ${gLifeCount} </td>`;
    var elHeading = document.querySelector('.heading');
    elHeading.innerHTML = strHTML;

}


function renderSafeClick() {
    var strHTML = 'Safe-Clicks ' + gSafeClicks;
    var elButton = document.querySelector('.safe-click');
    elButton.innerText = strHTML;
}


function showSafeCell(elButton) {
    if (!gGame.isOn || !gSafeClicks || !gFirstClick) return;

    var pos = gFreeSafeCells[0];

    while (pos && gBoard[pos.i][pos.j].isShown) {
        gFreeSafeCells.splice(0, 1);
        pos = gFreeSafeCells[0];
    }
    if (!pos) return;

    var elSafeCell = document.querySelector(`.cell${pos.i}-${pos.j}`);
    elSafeCell.classList.add('safe');
    setTimeout(function () {
        elSafeCell.classList.remove('safe');
    }, 3000);
    gSafeClicks--;
    elButton.innerText = 'Safe-Click ' + gSafeClicks;
}


function lostTheGame() {
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerHTML = SAD;
}

function lostLife() {
    var elLifeTd = document.querySelector('.life');
    audioLost.play();
    if (!gLifeCount) elLifeTd.innerText = 'Lost!';
    else elLifeTd.innerText = 'Life: ' + gLifeCount;
}

function wonTheGame() {
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerHTML = WINNER;
    var elLifeTd = document.querySelector('.life');
    elLifeTd.innerText = 'Won!';
    audioWon.play();
}



function renderTime() {
    var elTimeButton = document.querySelector('.time');
    elTimeButton.innerText = 'TIME: 00:00:000';
}


function restart(size) {
    gGame.isOn = false;
    clearInterval(gGameInterval);
    if (isManuallyPos) isManuallyPos = false;
    init(size);
}



function checkBestTime() {

    var isNewRec = false;
    var boardLevel = getLevel();
    if (gBoard.length === BEGINNER_BOARD) {
        if (gGame.timePassed < localStorage.getItem('Easy')) {
            boardLevel.record = gGame.timePassed;
            localStorage.setItem('Easy', boardLevel.record);
            isNewRec = true;
        }
    }
    else if (gBoard.length === MEDIUM_BOARD) {
        if (gGame.timePassed < localStorage.getItem('Medium')) {
            boardLevel.record = gGame.timePassed;
            localStorage.setItem('Medium', boardLevel.record);
            isNewRec = true;
        }
    }
    else {
        if (gGame.timePassed < localStorage.getItem('Expert')) {
            boardLevel.record = gGame.timePassed;
            localStorage.setItem('Expert', boardLevel.record);
            isNewRec = true;
        }
    }
    if (isNewRec) {
        renderNewRecord();
    }
}

function renderNewRecord() {
    var elRecord = document.querySelector('.record');
    var boardLevel = getLevel();
    elRecord.innerText = boardLevel.level + '-Record: ' + gGame.timePassed;
}


function renderRecordLevel() {
    var boardLevel = getLevel();
    var currRec = localStorage.getItem(boardLevel.level);
    var elRecord = document.querySelector('.record');

    if (currRec === MAX_TIME) {
        elRecord.innerText = boardLevel.level + ' Level waits for a record!';
    }
    else {
        elRecord.innerText = boardLevel.level + '-Record: ' + currRec;
    }
}



function giveHint() {
    if (!gFirstClick) return;
    if (!gGame.isOn) return;
    if (!gHintsCount) return;

    isAskedForHint = true;
    gHintsCount--;
    changeHintText();
}

function changeHintText() {
    var elHint = document.querySelector('.hint');
    if (!isStillHint) elHint.innerText = 'choose cell!'
    else elHint.innerText = `Hints: ${gHintsCount}`;
}


function hint(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (!isValidIdx(i, j) || gBoard[i][j].isMarked || gBoard[i][j].isShown) {
                continue;
            }
            var elTdCell = document.querySelector(`.cell${i}-${j}`);
            if (isAskedForHint) {
                if (gBoard[i][j].isMine) elTdCell.innerHTML = MINE_IMG;
                else if (gBoard[i][j].minesAroundCount === 0) elTdCell.innerText = '';
                else elTdCell.innerText = gBoard[i][j].minesAroundCount;
                elTdCell.classList.add('shown');
            }
            else {
                elTdCell.innerText = '';
                elTdCell.classList.remove('shown');
            }
        }
        if (isStillHint) {
            changeHintText();
            isStillHint = false;
        }
    }
}



function renderMinesPostion() {
    var elManual = document.querySelector('.manual');
    var minesNum = gMinesPositionCount - gMines.length;
    if (!minesNum) elManual.innerText = 'All mines are postioned';
    else elManual.innerText = 'there are ' + minesNum + ' mines to postion';
}

function renderManualMinesPosition() {
    var elManual = document.querySelector('.manual');
    elManual.innerHTML = 'Manually Mines postion';

}