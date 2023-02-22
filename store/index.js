import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', ()=>{
    const gameEnd = ref(false)
    const gameResult = ref(false)
    const winner = ref(null)
    const player = ref(0)
    const playerGuesses = ref([])
    const opponenetGuesses = ref([])

    const setGameEnd = ()=>{
        gameEnd.value = true
    }

    const setWinner = ()=>{
        winner.value = player.value
    }

    const setResult = (result)=>{
        gameResult.value = result
    }

    const getCurrentPlayer = computed(()=>{
        return player.value
    })

    const getPlayerGuesses = computed(()=>{
        return playerGuesses.value
    })

    const getOpponentGuesses = computed(()=>{
        return opponenetGuesses.value
    })

    const changeCurrentPlayer = ()=>{
        player.value = player.value === 0 ? 1 : 0
    }

    const addPlayerGuess = (guess)=>{
        playerGuesses.value.push(guess)
    }

    const addOpponentGuess = (guess)=>{
        opponenetGuesses.value.push(guess)
    }

    const reset = ()=>{
        gameEnd.value = false
        gameResult.value = false
        winner.value = null
        player.value = 0
        playerGuesses.value = []
        opponenetGuesses.value = []
    }

    return { gameEnd, winner, player, getCurrentPlayer, changeCurrentPlayer, addPlayerGuess, addOpponentGuess, getPlayerGuesses, getOpponentGuesses, setGameEnd, setWinner, setResult, gameResult, reset }
})
