'use stirct'

var gGameInterval;


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}



function isValidIdx(i, j) {
    if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length) return false;
    return true;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}




function startTime() {
    var start = Date.now();
    gGameInterval = setInterval(function () {
        if (gGame.isOn)
            printTime(start);
    }, .001);
}




/* function to print the time to the screen */
function printTime(start) {
    var now = Date.now();
    var timePassed = now - start;


    // casting to integer numbers
    var minutes = parseInt((timePassed / 60000) % 60);
    var seconds = parseInt((timePassed / 1000) % 60);
    var milsecond = parseInt(timePassed % 1000);

    //adding zeros for represnting a valid stopwatch
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;
    if (milsecond < 100)
        milsecond = "0" + milsecond;
    if (milsecond < 10)
        milsecond = "0" + milsecond;

    //variable to contain to components, who builds the stopwatch
    var representTime = minutes + ":" + seconds + ":" + milsecond;
    gGame.timePassed = representTime;

    //represnting the passed time
    document.querySelector('.time').innerText = "Your time: " + representTime;

}



function getLevel() {
    if (gBoard.length === BEGINNER_BOARD) return gLevels[0];
    if (gBoard.length === MEDIUM_BOARD) return gLevels[1];
    if (gBoard.length === EXPERT_BOARD) return gLevels[2];
}


