import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid';

export const useGameStore = defineStore('game', ()=>{
    const gameEnd = ref(false)
    const gameResult = ref(false)
    const winner = ref(null)
    const currentPlayer = ref('id')
    const playerTurn = ref(true)
    const playerGuesses = ref([])
    const opponenetGuesses = ref([])

    const setGameEnd = ()=>{
        gameEnd.value = true
    }

    const setWinner = (id)=>{
        winner.value = id
    }

    const setResult = (result)=>{
        gameResult.value = result
    }

    const setCurrentPlayer = (id)=>{
        currentPlayer.value = id
    }

    const getCurrentPlayer = computed(()=>{
        return currentPlayer.value
    })

    const addPlayerGuess = (guess)=>{
        playerGuesses.value.push(guess)
    }

    const getPlayerGuesses = computed(()=>{
        return playerGuesses.value
    })

    const getOpponentGuesses = computed(()=>{
        return opponenetGuesses.value
    })

    const addOpponentGuess = (guess)=>{
        opponenetGuesses.value.push(guess)
    }

    const changePlayerTurn = ()=>{
        playerTurn.value = !playerTurn.value
    }

    const setInitialPlayerTurn = (e)=>{
        playerTurn.value = e
    }

    const reset = ()=>{
        // gameEnd.value = false
        // gameResult.value = false
        // // winner.value = null
        // playerGuesses.value = []
        // opponenetGuesses.value = []
    }

    return { gameEnd, winner, getCurrentPlayer, addPlayerGuess, addOpponentGuess, getPlayerGuesses, getOpponentGuesses, setGameEnd, setWinner, setResult, gameResult, reset, setCurrentPlayer, changePlayerTurn, playerTurn, setInitialPlayerTurn }
})
