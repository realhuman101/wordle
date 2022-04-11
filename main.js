// START UP
var setWord;
var started;
var letters;
var word;
var wordChars;
var userWord;
var userWordChars;
var currentBox;
var currentRow;
var hardMode;
var correctChars;
var wrongPlace;
var playing;
var settingShow;
var statsSet;

if (!setWord) {
    letters = 5;

    checkHelp();

    var selection = easyWords[5];
    var data = allWords[5];

    word = selection[Math.floor((Math.random() * selection.length))];
    wordChars = word.split("");
    userWord = "";

    correctChars = [];
    wrongPlace = [];

    console.log("running");

    hardMode = false;
    playing = true;
    settingShow = false;
    started = false;
    statsSet = false;

    setWord = true;
}

// CONFIGURE SETTINGS
function showSettings () {
    document.getElementById('settings').style.display = 'block';
    settingShow = true;
    if (started) {
        document.getElementById('noSetting').style.display = 'block';
        document.getElementById('settingContent').style.display = 'none';
    } else {
        document.getElementById('lenConTxt').innerText = letters.toString();
        document.getElementById('noSetting').style.display = 'none';
        document.getElementById('settingContent').style.display = 'block';
    }
}

['click','touchend'].forEach( function(evt) {
    window.addEventListener(evt, function(e){   
        if (settingShow) {
            if (document.getElementById('settings') == e.target){
                document.getElementById('settings').style.display = 'none';
                settingShow = false;
            }
        }
        if (document.getElementById('gameover').style.display == 'block') {
            if (document.getElementById('gameover') == e.target){
                document.getElementById('gameover').style.display = 'none';
            }
        }
        if (document.getElementById('help').style.display == 'block') {
            if (document.getElementById('help') == e.target){
                document.getElementById('help').style.display = 'none';
            }
        }
    });
});

document.getElementById('lengthSelect').oninput = function () {
    inputLen = document.getElementById('lengthSelect');
    letters = parseInt(inputLen.value);
    
    document.getElementById('lenConTxt').innerText = letters.toString();

    selection = easyWords[letters];
    data = allWords[letters];

    word = selection[Math.floor((Math.random() * selection.length))];

    wordChars = word.split("");
    currentAvRow = 5;
    for(let currentLenRows = 6; currentLenRows <= 10; currentLenRows++){
        let theRows = document.getElementsByName(currentLenRows.toString());
        for (let item = 0; item < theRows.length; item++) {
            if(theRows[item].style.display == 'block') {
                currentAvRow = currentLenRows;
            }
        }
    }
    for (let rows = 6; rows <= letters; rows++) {
        let theRows = document.getElementsByName(rows.toString());
        for (let item = 0; item < theRows.length; item++) {
            theRows[item].style.display = 'block';
        }
    }
    for (let rows = 10; rows > letters; rows--) {
        let theRows = document.getElementsByName(rows.toString());
        for (let item = 0; item < theRows.length; item++) {
            theRows[item].style.display = 'none';
        }
    }
}

document.getElementById('hardMode').oninput = function () {
    hardMode = document.getElementById('hardMode').checked;
}

// SETUP HELP POPUP
function showHelp () {
    document.getElementById('help').style.display = 'block';
}

function checkHelp () {
    if (typeof getCookie('playedBefore') === 'undefined') {
        document.getElementById('help').style.display = 'block';
        setCookie('playedBefore', 'yes');
    }
}

// CHECK KEY
document.addEventListener("keydown", function(e) {
    var keynum = e.key;
    if (playing) {
        if((/[a-zA-Z]/).test(keynum) == true && keynum.length == 1) {
            inputCharacter(keynum);
            started = true;
        } else if (keynum == "Enter") {
            checkWord();
        } else if (keynum == "Backspace"){
            deleteChar();
        }
    } else if (keynum == 'Enter') {
        showGameover();
    }
});

// REGISTER KEYBOARD
if (playing) {
    var buttons = document.getElementsByClassName("key");
    var buttonsCount = buttons.length;
    for (var i = 0; i <= buttonsCount; i += 1) {
        buttons[i].ontouchstart = setTimeout(function(e) {
            char = this.id;
            if (char == "Enter") {
                checkWord();
            } else if (char == "Backspace") {
                deleteChar();
            } else {
                inputCharacter(char.toLowerCase());
            }
        }, 500);
        buttons[i].onclick = function(e) {
            char = this.id;
            if (char == "Enter") {
                checkWord();
            } else if (char == "Backspace") {
                deleteChar();
            } else {
                inputCharacter(char.toLowerCase());
            }
        };
    }
} else {
    var enterKey = document.getElementById("Enter");
    buttons[i].ontouchstart = setTimeout(function(e) {
        showGameover();
    }, 500);
    buttons[i].onclick = function(e) {
        showGameover();
    };
}

// WRITE KEYS
function inputCharacter (char) {
    if (currentBox == "0" || currentBox == "-1") {
        currentBox = "1";
    }
    if (char !== 'Backspace') {
        if (typeof inputting == 'undefined') {
            inputting = true;
        }
        if (typeof currentRow == 'undefined' || currentRow == "0") {
            currentRow = "row1";
        }
        if (typeof currentBox == 'undefined') {
            currentBox = "1";
        } else if (currentBox == letters.toString()) {
            return;
        } else {
            currentBox = (parseInt(currentBox) + 1).toString();
        }
        box = document.querySelectorAll(`.${currentRow}[name='${currentBox}']`);
        for(var i = 0; i < box.length; i++){
            box[i].innerText=char;    
            box[i].style.border = "2px solid rgb(180, 180, 180)";
            if (box[i].classList.contains('apply-zoom')) {
                var boxItm = box[i].cloneNode(true);
                box[i].parentNode.replaceChild(boxItm,box[i]);
            } else {
                box[i].classList.add("apply-zoom");
            }
            userWord += char;
        }
    }
}

function deleteChar () {
    if (typeof currentBox !== 'undefined' && typeof currentRow !== 'undefined') {
        box = document.querySelectorAll(`.${currentRow}[name='${currentBox}']`);
        for(let ind = 0; ind < box.length; ind++){
            box[ind].innerText = "";
            box[ind].style.border = '2px solid darkgray';
        }
        currentBox = (parseInt(currentBox) - 1).toString();
        userWord = userWord.slice(0, -1);
        if (currentBox == "0" || currentBox == "-1") {
            currentBox = undefined;
        }
    }
}

function resetRows () {
    if (typeof currentRow == 'undefined') {
        currentRow = "row1";
    } else if (currentRow != 'row6') {
        currentRow = "row" + (parseInt(currentRow.charAt(3)) + 1).toString();
    } else if (currentRow == "row6") {
        gameOver(false);
    }
    userWord = "";
    currentBox = undefined;
}

// CHECK WORD CORRECT
function checkWord () {
    if (playing) {
        userWord = userWord.toLowerCase();
        if (userWord.length == letters && data.includes(userWord)) {
            if (!hardMode) {
                if (userWord == word) {
                    for(let ind = 0; ind <= letters; ind++){
                        box = document.querySelectorAll(`.${currentRow}[name='${ind}']`);
                        for(var i = 0; i < box.length; i++){
                            box[i].style.backgroundColor = "#6aaa64";   
                            box[i].style.color = "white";
                            box[i].style.border = "2px solid rgb(180, 180, 180)";
                            box[i].classList.add("apply-dance");
                        }
                    }
                    gameOver(true);
                } else {
                    var occurances = {};
                    var wordList = word.split("");
                    var userList = userWord.split("");
                    for (let ind = 0; ind < letters; ind++) {
                        occurances[wordList[ind]] = 0;
                    }
                    for (let ind = 0; ind < letters; ind++) {
                        occurances[wordList[ind]] = occurances[wordList[ind]] + 1;
                        keys = document.getElementById(userList[ind].toUpperCase());
                        box = document.querySelectorAll(`.${currentRow}[name='${ind+1}']`);
                        for (var i = 0; i < box.length; i++) {
                            box[i].style.backgroundColor = "DarkGrey"; 
                            if (!(keys.classList.contains("wrong-location"))) {
                                keys.classList.add("wrong");  
                            }
                            box[i].style.color = "white";
                        }
                    }
                    for (let ind = 0; ind < letters; ind++) {
                        keys = document.getElementById(userList[ind].toUpperCase());
                        if (wordList[ind] == userList[ind] && occurances[wordList[ind]] > 0) {
                            box = document.querySelectorAll(`.${currentRow}[name='${ind+1}']`);
                            for(var i = 0; i < box.length; i++){
                                box[i].style.backgroundColor = "#6aaa64";   
                                box[i].style.color = "white";
                                if (keys.classList.contains("wrong")) {
                                    keys.classList.remove("wrong");
                                }
                                keys.classList.add("correct");
                                occurances[wordList[ind]] = occurances[wordList[ind]] - 1;
                            }
                        } 
                    }
                    for (let ind = 0; ind < letters; ind++) {
                        keys = document.getElementById(userList[ind].toUpperCase());
                        if ((wordList.includes(userList[ind]) && occurances[userList[ind]] > 0) && userList[ind] !== wordList[ind]) {
                            box = document.querySelectorAll(`.${currentRow}[name='${ind+1}']`);
                            box[0].style.backgroundColor = "#c9b458";
                            box[0].style.color = "white";
                            if (keys.classList.contains("wrong")) {
                                keys.classList.remove("wrong");
                            }
                            keys.classList.add("wrong-location");
                            console.log('correct')
                            occurances[userList[ind]] = occurances[userList[ind]] - 1;
                        }
                    }
                    for (let ind = 0; ind < letters; ind++) {
                        box = document.querySelectorAll(`.${currentRow}[name='${ind+1}']`);
                        for(var i = 0; i < box.length; i++){
                            box[i].style.color = "white";
                            box[i].style.border = "2px solid rgb(180, 180, 180)";
                            box[i].classList.add('apply-flip');
                        }
                    }
                    resetRows();
                }
            } else {
                if (userWord == word) {
                    for(let ind = 0; ind <= letters; ind++){
                        box = document.querySelectorAll(`.${currentRow}[name='${ind}']`);
                        for(var i = 0; i < box.length; i++){
                            box[i].style.backgroundColor = "#6aaa64";   
                            box[i].style.color = "white";
                            box[i].style.border = "2px solid rgb(180, 180, 180)";
                            box[i].classList.add("apply-dance");
                        }
                    }
                    gameOver(true);
                } else {
                    var occurances = {};
                    var wordList = word.split("");
                    var userList = userWord.split("");
                    for (let ind = 0; ind < letters; ind++) {
                        occurances[wordList[ind]] = 0;
                    }
                    if (hardmodeCheck()[0]) {
                        var warning = document.getElementById('warning');
                        warning.innerText = hardmodeCheck()[1];
                        warning.style.visibility = 'visible';
                        const row = document.querySelector(`.rows${currentRow.charAt(3)}`);

                        row.classList.add("apply-shake");

                        row.addEventListener("animationend", (e) => {
                            row.classList.remove("apply-shake");
                        });
                        setTimeout( function() {
                            warning.style.visibility = 'hidden';
                            warning.innerText = 'Word not in word list';
                        },1000);
                        return;
                    } else {
                        for (let ind = 0; ind < letters; ind++) {
                            occurances[wordList[ind]] = 0;
                        }
                        for (let ind = 0; ind < letters; ind++) {
                            occurances[wordList[ind]] = occurances[wordList[ind]] + 1;
                            keys = document.getElementById(userList[ind].toUpperCase());
                            box = document.querySelectorAll(`.${currentRow}[name='${ind+1}']`);
                            for (var i = 0; i < box.length; i++) {
                                box[i].style.backgroundColor = "DarkGrey"; 
                                if (!(keys.classList.contains("wrong-location"))) {
                                    keys.classList.add("wrong");  
                                }
                                box[i].style.color = "white";
                            }
                        }
                        for (let ind = 0; ind < letters; ind++) {
                            keys = document.getElementById(userList[ind].toUpperCase());
                            if (wordList[ind] == userList[ind] && occurances[wordList[ind]] > 0) {
                                box = document.querySelectorAll(`.${currentRow}[name='${ind+1}']`);
                                for(var i = 0; i < box.length; i++){
                                    box[i].style.backgroundColor = "#6aaa64";   
                                    box[i].style.color = "white";
                                    if (keys.classList.contains("wrong")) {
                                        keys.classList.remove("wrong");
                                    }
                                    keys.classList.add("correct");
                                    correctChars.push([ind,wordList[ind]]);
                                    occurances[wordList[ind]] = occurances[wordList[ind]] - 1;
                                }
                            } 
                        }
                        for (let ind = 0; ind < letters; ind++) {
                            keys = document.getElementById(userList[ind].toUpperCase());
                            if ((wordList.includes(userList[ind]) && occurances[userList[ind]] > 0) && userList[ind] !== wordList[ind]) {
                                box = document.querySelectorAll(`.${currentRow}[name='${ind+1}']`);
                                box[0].style.backgroundColor = "#c9b458";
                                box[0].style.color = "white";
                                if (keys.classList.contains("wrong")) {
                                    keys.classList.remove("wrong");
                                }
                                keys.classList.add("wrong-location");
                                wrongPlace.push([ind,userList[ind]]);
                                occurances[userList[ind]] = occurances[userList[ind]] - 1;
                            }
                        }
                        for (let ind = 0; ind < letters; ind++) {
                            box = document.querySelectorAll(`.${currentRow}[name='${ind+1}']`);
                            for(var i = 0; i < box.length; i++){
                                box[i].style.color = "white";
                                box[i].style.border = "2px solid rgb(180, 180, 180)";
                                box[i].classList.add('apply-flip');
                            }
                        }
                        resetRows();
                    }
                }
            }
        } else if (userWord.length == letters) {
            document.getElementById('warning').style.visibility = 'visible';
            const row = document.querySelector(`.rows${currentRow.charAt(3)}`);

            row.classList.add("apply-shake");

            row.addEventListener("animationend", (e) => {
                row.classList.remove("apply-shake");
            });
            setTimeout( function() {
                document.getElementById('warning').style.visibility = 'hidden'
            },1000);
        }
    }
}

function hardmodeCheck() {
    var userList = userWord.split('');
    var correctLetters = correctChars.map(b=>b[1]);
    var wrongLetters = wrongPlace.map(b=>b[1]);
    var correctOccurances = {};
    var wrongOccurances = {};
    for (let i = 0; i < correctLetters.length; i++) {
        correctOccurances[correctLetters[i]] = 0;
    }
    for (let i = 0; i < wrongLetters.length; i++) {
        wrongOccurances[wrongLetters[i]] = 0;
    }
    for (let i = 0; i < correctLetters.length; i++) {
        correctOccurances[correctLetters[i]] = correctOccurances[correctLetters[i]] + 1;
    }
    for (let i = 0; i < wrongLetters.length; i++) {
        wrongOccurances[wrongLetters[i]] = wrongOccurances[wrongLetters[i]] + 1;
    }

    for (let ind = 0; ind < letters; ind++) {
        if (((correctChars.map(b=>b[1])).includes(userList[ind]) && ind !== correctChars[correctChars.map(b=>b[1]).indexOf(userList[ind])][0]) && correctOccurances[userList[ind]] !== 0) {
            correctOccurances[userList[ind]] = correctOccurances[userList[ind]] - 1
            return [true,`The letter '${userList[ind].toUpperCase()}' needs to be in it's correct position`];
        } else if (((wrongPlace.map(b=>b[1])).includes(userList[ind]) && ind == wrongPlace[wrongPlace.map(b=>b[1]).indexOf(userList[ind])][0]) && wrongOccurances[userList[ind]] !== 0) {
            wrongOccurances[userList[ind]] = wrongOccurances[userList[ind]] - 1
            return [true,`The letter '${userList[ind].toUpperCase()}' cannot be in the same place as before`];
        }
    }

    for (let ind = 0; ind < wrongPlace.length; ind++) {
        if (!(userList.includes(wrongPlace.map(b=>b[1])[ind]))) {
            return [true,`You have not included the letter '${wrongPlace.map(b=>b[1])[ind].toUpperCase()}' in your guess`];
        }
    }
    for (let ind = 0; ind < correctChars.length; ind++) {
        if (!(userList.includes(correctChars.map(b=>b[1])[ind]))) {
            return [true, `You have not included the letter '${correctChars.map(b=>b[1])[ind].toUpperCase()}' in your guess`];
        }
    }

    return [false];
}

// COOKIE FUNCTIONS
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return undefined;
}

// GAME OVER
function gameOver (win) {
    var maintext = document.getElementById("maintxt");
    var subtext = document.getElementById("subtxt");

    if (win) {
        maintext.innerHTML = "Congratulations! You won!";
        subtext.innerHTML = "Great job! You guessed the word!";
    } else {
        maintext.innerHTML = "Oh no! You lost!";
        subtext.innerHTML = `The word was ${word}... You'll get it next time!`;
    }
    setStats(win);
    showGameover();
    playing = false;
}

document.getElementById('replay').onclick = replay();

function replay() {
    location.reload();
}

document.getElementById('gameover').onclick = hideGameover();
function hideGameover() {
    var gameover = document.getElementById("gameover");
    gameover.style.display = "none";
}

function showGameover() {
    var gameover = document.getElementById("gameover");
    gameover.style.display = "block";
}

// STATISTICS
function setStats (win) {
    if (!statsSet) {
        attemptTxt = ''
        skillTxt = ''
        if (letters == 5) {
            if (!hardMode) {
                attemptTxt = 'attempts';
                skillTxt = "skill";
                document.getElementById('statText').innerText = 'Statistics';
            } else {
                attemptTxt = 'HARDattempts';
                skillTxt = "HARDskill";
                document.getElementById('statText').innerText = 'Statistics for Hard Mode';
            }
        } else {
            if (!hardMode) {
                attemptTxt = letters.toString()+'attempts';
                skillTxt = letters.toString()+"skill";
                document.getElementById('statText').innerText = 'Statistics for '+letters.toString()+" letters";
            } else {
                attemptTxt = "HARD"+letters.toString()+'attempts';
                skillTxt = "HARD"+letters.toString()+"skill";
                document.getElementById('statText').innerText = 'Statistics for Hard Mode, with '+letters.toString()+" letters";
            }
        }
        var stats = []
        if (typeof getCookie(attemptTxt) == 'undefined') {
            setCookie(attemptTxt,'1');
            attempts = 1;
        } else {
            attempts = parseInt(getCookie(attemptTxt)) + 1;
            setCookie(attemptTxt,attempts.toString());
        }
        for (let row = 1; row <= 6; row++) {
            if (typeof getCookie(skillTxt+row.toString()) == "undefined") {
                setCookie(skillTxt+row.toString(),"0");
                stats.push(0);
            } else {
                stats.push(parseInt(getCookie(skillTxt+row.toString())));
            }
        }
        let tries = parseInt(currentRow.charAt(3));
        if(win) {
            stats[tries-1] = parseInt(stats[tries-1])+1;
        }
        correct = stats.reduce((partialSum, a) => partialSum + a, 0);
        max = Math.max.apply(Math,stats);
        setCookie(`${skillTxt}${tries}`,(stats[tries-1]).toString());

        for (let skill = 0; skill < 6; skill++) {
            if (stats[skill] !== 0) {
                skillBar = document.getElementById(`skill${skill+1}`);
                skillBar.style.width = `${100*(stats[skill]/max)}%`;
                skillBar.innerText = stats[skill].toString();
            } else {
                skillBar = document.getElementById(`skill${skill+1}`);
                skillBar.style.width = `0%`;
                skillBar.innerText = stats[skill].toString();
            }
        }

        document.getElementById('winContentBlock').style.display = 'block';

        let playedStat = document.getElementById('playedStat');
        let winStat = document.getElementById('winStat');
        let winPStat = document.getElementById('winPStat');

        playedStat.innerText = attempts;
        winStat.innerText = correct;
        winPStat.innerText = parseInt(100*(correct/attempts));
        statsSet = true;
    }
}

function showStats () {
    attemptTxt = ''
    skillTxt = ''
    if (letters == 5) {
        if (!hardMode) {
            attemptTxt = 'attempts';
            skillTxt = "skill";
            document.getElementById('statText').innerText = 'Statistics';
        } else {
            attemptTxt = 'HARDattempts';
            skillTxt = "HARDskill";
            document.getElementById('statText').innerText = 'Statistics for Hard Mode';
        }
    } else {
        if (!hardMode) {
            attemptTxt = letters.toString()+'attempts';
            skillTxt = letters.toString()+"skill";
            document.getElementById('statText').innerText = 'Statistics for '+letters.toString()+" letters";
        } else {
            attemptTxt = "HARD"+letters.toString()+'attempts';
            skillTxt = "HARD"+letters.toString()+"skill";
            document.getElementById('statText').innerText = 'Statistics for Hard Mode, with '+letters.toString()+" letters";
        }
    }
    var stats = [];
    if (typeof getCookie(attemptTxt) == 'undefined') {
        setCookie(attemptTxt,'0');
        attempts = 0;
    } else {
        attempts = parseInt(getCookie(attemptTxt));
    }
    for (let row = 1; row <= 6; row++) {
        if (typeof getCookie(skillTxt+row.toString()) == "undefined") {
            setCookie(skillTxt+row.toString(),"0");
            stats.push(0);
        } else {
            stats.push(parseInt(getCookie(skillTxt+row.toString())));
        }
    }

    let correct = stats.reduce((partialSum, a) => partialSum + a, 0);
    let max = Math.max.apply(Math,stats);

    for (let skill = 0; skill < 6; skill++) {
        if (stats[skill] !== 0) {
            skillBar = document.getElementById(`skill${skill+1}`);
            skillBar.style.width = `${100*(stats[skill]/max)}%`;
            skillBar.innerText = stats[skill].toString();
        } else {
            skillBar = document.getElementById(`skill${skill+1}`);
            skillBar.style.width = `0%`;
            skillBar.innerText = stats[skill].toString();
        }
    }

    let playedStat = document.getElementById('playedStat');
    let winStat = document.getElementById('winStat');
    let winPStat = document.getElementById('winPStat');

    playedStat.innerText = attempts;
    winStat.innerText = correct;
    winPStat.innerText = parseInt(100*(correct/attempts));

    document.getElementById('winContentBlock').style.display = 'none';
    document.getElementById('replay').innerText = 'Retry?';

    if (!playing) {
        document.getElementById("maintxt").style.display = 'block';
        document.getElementById("subtxt").style.display = 'block';
        document.getElementById('winContentBlock').style.display = 'block';
        document.getElementById('replay').innerText = 'Play Again?';
    }

    showGameover();
}