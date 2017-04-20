var guessFiled = document.querySelector('.guessField')
var guesses = document.querySelector('.guesses')
var lastResult = document.querySelector('.lastResult')
var lowOrHigh = document.querySelector('.lowOrHigh')
var guessSubmit = document.querySelector('.guessSubmit')

var randomNumber = Math.floor(Math.random() * 100) + 1
var countGuess = 1
var resetButton

guessSubmit.addEventListener('click', guessfunc)


function guessfunc() {
    var userGuessNum = Number(guessFiled.value)
    if(countGuess == 1) {
        guesses.textContent = 'Prev guesses: '
    }
    guesses.textContent += userGuessNum +' '

    if(userGuessNum == randomNumber) {
        lastResult.style.backgroundColor = 'green'
        lastResult.textContent = 'Bingo'
        lowOrHigh.textContent = ''
        setGameOver()
    } else if(countGuess == 10) {
        lastResult.style.backgroundColor = 'red'
        lastResult.textContent = 'Game over, you fail'
        setGameOver()
    } else {
        lastResult.style.backgroundColor = 'red'
        lastResult.textContent = 'Wrong'
        if(userGuessNum < randomNumber) {
            lowOrHigh.textContent = 'low'
        } else if(userGuessNum > randomNumber) {
            lowOrHigh.textContent = 'high'
        }
    }
    countGuess++
    guessFiled.value = ''
    guessFiled.focus()
}

function setGameOver() {
    guessFiled.disabled = true
    guessSubmit.disabled = true
    resetButton = document.createElement('button')
    resetButton.textContent = 'Restart game'
    document.body.appendChild(resetButton)
    resetButton.addEventListener('click', resetGame)
}

function resetGame() {
    countGuess = 1

    guessFiled.disabled = false
    guessSubmit.disabled = false
    
    guessFiled.value = ''
    guessFiled.focus()

    lastResult.style.backgroundColor = 'white'
    lowOrHigh.textContent = ''
    randomNumber = Math.floor(Math.random() * 100) + 1
}