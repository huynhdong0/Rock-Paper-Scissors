let userMove = '';
let numberRandom;
let cMove = '';
let result = '';
let isAutoPlaying = false;
let intervalID;
const icons = {
    Rock: 'images/rock-emoji.png',
    Paper: 'images/paper-emoji.png',
    Scissors: 'images/scissors-emoji.png'
};

let Scores = {
    wins: 0,
    loses: 0,
    ties: 0,
    histories: [],
    // save data
    save() {
        localStorage.setItem('Scores', JSON.stringify(this));
    },
    // load data
    load() {
        let scores = JSON.parse(localStorage.getItem('Scores'));
        if (scores) {
            this.wins = scores.wins;
            this.loses = scores.loses;
            this.ties = scores.ties;
            this.histories = scores.histories;
        }
    }
}

// load data from local storage
Scores.load();


function removeAutoPlay() {
    if(isAutoPlaying == true) {
        clearInterval(intervalID);
        isAutoPlaying = false;
    }
}

// playing 
document.querySelector('.js-rock-button').addEventListener('click', () => {
    removeAutoPlay();
    play('Rock');
});

document.querySelector('.js-paper-button').addEventListener('click', () => {
    removeAutoPlay();
    play('Paper');
});

document.querySelector('.js-scissors-button').addEventListener('click', () => {
    removeAutoPlay();
    play('Scissors');
});

document.querySelector('.js-reset-button').addEventListener('click', () => {
    reset();
    showHistories('reset');
});

document.querySelector('.js-auto-button').addEventListener('click', () => {
    autoPlay();
});

// playing by typing the first character of each rock paper scissors
document.body.addEventListener('keydown', (event) => {
    if (event.key == 'r') {
        play('Rock');
    } else if (event.key == 'p')  {
        play('Paper');
    } else if (event.key == 's') {
        play('Scissors');
    }
})

// generate moving
function generateMove() {
    const moves = ['Rock', 'Paper', 'Scissors'];
    numberRandom = Math.floor(Math.random() * 3); // take randomly a number from [0,1,2]
    return moves[numberRandom];
}

// auto playing mode
function autoPlay() {
    if(!isAutoPlaying) {
        intervalID = setInterval(function(){
            const userMove = generateMove();
            play(userMove);
        }, 1000)
        isAutoPlaying = true;
    } else {
        clearInterval(intervalID);
        isAutoPlaying = false;
    }
}


// Play rock paper scissors
function play(userMove) {
    cMove =  generateMove();
    if (userMove === cMove) {
        result = 'Tie';
        Scores.ties++;
    } else if ((userMove === 'Rock' && cMove === 'Scissors') || 
               (userMove === 'Paper' && cMove === 'Rock') || 
               (userMove === 'Scissors' && cMove === 'Paper')) {
        result = 'User Wins';
        Scores.wins++;
    } else {
        result = 'Computer Wins';
        Scores.loses++;
    }
    const cMoveIcon = `<img class="move-icon" src="${icons[cMove]}" alt="${cMove}">`;
    const userMoveIcon = `<img class="move-icon" src="${icons[userMove]}" alt="${userMove}">`;
    showResult(userMove, cMove, result);
    if (result == 'User Wins'){
        const win = `<img class="result-icon" src="images/win.png" alt="${result}">`;
        showHistories(`Computer: ${cMoveIcon} | 
                        User: ${userMoveIcon} | 
                        Result: <span style="color: green;">${result}</span> ${win}`);
    } else if (result == 'Computer Wins') {
        const lose = `<img class="result-icon" src="images/lose.png" alt="${result}">`;
        showHistories(`Computer: ${cMoveIcon} | 
                        User: ${userMoveIcon} | 
                        Result: <span style="color: red;">${result}</span> ${lose}`);
    } else if (result == 'Tie') {
        const tie = `<img class="result-icon" src="images/confused.png" alt="${result}" >`;
        showHistories(`Computer: ${cMoveIcon} | 
                        User: ${userMoveIcon} | 
                        Result: <span style="color: brown;">${result}</span> ${tie}`);    }
    Scores.histories.push(`Computer: ${cMove} | User: ${userMove} | Result: ${result}`);
    showScore();
    Scores.save();
}  

// reset
function reset() {
    localStorage.removeItem('Scores');
    location.reload();
}


// result show section
function showResult(userMove, cMove, rs) {
    const userElement= document.querySelector('.user-move-icon');
    const computerElement = document.querySelector('.computer-move-icon');
    const result = document.querySelector('.result');
    const cMoveIcon = `<img class="result-move-icon" src="${icons[cMove]}" alt="${cMove}">`;
    const userMoveIcon = `<img class="result-move-icon" src="${icons[userMove]}" alt="${userMove}">`;
    if (rs == 'User Wins'){
        result.innerHTML = `<span style="color: green;">${rs}</span>`
    } else if (rs == 'Computer Wins') {
        result.innerHTML = `<span style="color: red;">${rs}</span>`
    } else if (rs == 'Tie') {
        result.innerHTML = `<span style="color: brown;">${rs}</span>`
    }
    userElement.innerHTML = userMoveIcon;
    computerElement.innerHTML = cMoveIcon;
}


// histories show section
function showHistories(history) {
    let hisLines = document.querySelector('.his-lines');
    if (history == 'reset') {
        hisLines.innerHTML = '';
    } else {
        const historyLine = document.createElement('div');
        historyLine.innerHTML = history;
        hisLines.append(historyLine);
    }
    Scores.histories.forEach(history => console.log(history));
}

// scores show section
function showScore() {
    show('.user-scores');
    show('.computer-scores');
    function show(name) {
        const Score  = document.querySelector(name);
        // clear scores
        Score.innerHTML = '';
        const ScoreLine_1 = document.createElement('div');
        const ScoreLine_2 = document.createElement('div');
        const ScoreLine_3 = document.createElement('div');

        if (name == '.user-scores'){
            ScoreLine_1.innerHTML = 'Wins: <span style="color: green;">' + Scores.wins + '</span>';
            ScoreLine_2.innerHTML = 'Losses: <span style="color: red;">' + Scores.loses + '</span>';
            ScoreLine_3.innerHTML = 'Ties: <span style="color: brown;">' + Scores.ties + '</span>';
        } else if (name == '.computer-scores') {
            ScoreLine_1.innerHTML = 'Wins: <span style="color: green;">' + Scores.loses + '</span>';
            ScoreLine_2.innerHTML = 'Losses: <span style="color: red;">' + Scores.wins + '</span>';
            ScoreLine_3.innerHTML = 'Ties: <span style="color: brown;">' + Scores.ties + '</span>';
        }
        Score.appendChild(ScoreLine_1);
        Score.appendChild(ScoreLine_2);
        Score.appendChild(ScoreLine_3);
    }
}


