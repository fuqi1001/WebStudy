var randomNumber = Math.floor(Math.random() * 100) + 1

var guesses = document.querySelector('.guesses')
var lastResult = document.querySelector('.lastResult')
var lowOrHigh = document.querySelector('.lowOrHigh')

var guessSubmit = document.querySelector('.guessSubmit')
var guessField = document.querySelector('.guessField')

var guessCount = 1
var resetButton

function setGameOver() {
    guessField.disabled = true
    guessSubmit.disabled = true
    resetButton = document.createElement('button')
    resetButton.textContent = 'Reset'
    document.body.appendChild(resetButton)
    resetButton.addEventListener('click', resetGame)
}

function resetGame() {
    guessCount = 1

    var resetParas = document.querySelectorAll('.resultParas p')
    for(var i = 0; i < resetParas.length; i++) {
        resetParas[i].textContent = ''
    }

    resetButton.parentNode.removeChild(resetButton)

    guessField.disabled = false
    guessSubmit.disabled = false
    guessField.value = ''
    guessField.focus()

    lastResult.style.backgroundColor = 'white'
    randomNumber = Math.floor(Math.random() * 100) + 1
}
function guessFunc() {
    var userGuessNum = Number(guessField.value);
    if(guessCount == 1) {
        guesses.textContent= 'Prev guess:'
    }
    guesses.textContent += userGuessNum + ' '

    if(userGuessNum == randomNumber) {
        lastResult.textContent = 'Bingo!'
        lastResult.style.backgroundColor = 'green'
        lowOrHigh.textContent = ''
        setGameOver()
    } else if(guessCount == 10) {
        lastResult.textContent = 'Game Over, you fail'
        setGameOver()
    } else {
        lastResult.textContent = 'Wrong'
        lastResult.style.backgroundColor = 'red'
        if(userGuessNum < randomNumber) {
            lowOrHigh.textContent = 'lower'
        } else if(userGuessNum > randomNumber) {
            lowOrHigh.textContent = 'higher'
        }
    }

    guessCount++;
    guessField.value = '';
    guessField.focus();
}

guessSubmit.addEventListener('click', guessFunc)
