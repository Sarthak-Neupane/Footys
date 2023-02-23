import { defineStore } from 'pinia'
// import { useStorage } from '@vueuse/core'
// import { v4 as uuidv4 } from 'uuid'

export const useGameStore = defineStore('game', () => {
  const gameId = ref(null)
  const gameEnd = ref(false)
  const gameResult = ref(false)
  const winner = ref(null)
  const currentPlayer = ref('id')
  const playerColor = ref(null)
  const opponentColor = ref(null)
  const playerTurn = ref(true)
  const playerGuesses = ref([])
  const opponenetGuesses = ref([])

  const setGameId = id => {
    gameId.value = id
  }

  const setGameEnd = () => {
    gameEnd.value = true
  }

  const setResult = result => {
    gameResult.value = result
  }

  const setWinner = id => {
    winner.value = id
  }

  const getCurrentPlayer = computed(() => {
    return currentPlayer.value
  })
  const setCurrentPlayer = id => {
    currentPlayer.value = id
  }

  const getPlayerColor = computed(() => {
    return playerColor.value
  })
  const getOpponentColor = computed(() => {
    return opponentColor.value
  })
  const setPlayerColor = (color) => {
    playerColor.value = color
    opponentColor.value = (color) === 'green' ? 'blue' : 'green'
  }

  const setInitialPlayerTurn = e => {
    playerTurn.value = e
  }
  const changePlayerTurn = () => {
    playerTurn.value = !playerTurn.value
  }
  
  const getPlayerGuesses = computed(() => {
    return playerGuesses.value
  })
  const addPlayerGuess = guess => {
    playerGuesses.value.push(guess)
  }
  
  const getOpponentGuesses = computed(() => {
    return opponenetGuesses.value
  })
  const addOpponentGuess = guess => {
    opponenetGuesses.value.push(guess)
  }

  return {
    gameId,
    setGameId,
    gameEnd,
    setGameEnd,
    gameResult,
    setResult,
    winner,
    setWinner,
    getCurrentPlayer,
    setCurrentPlayer,
    getPlayerColor,
    getOpponentColor,
    setPlayerColor,
    playerTurn,
    setInitialPlayerTurn,
    changePlayerTurn,
    getPlayerGuesses,
    addPlayerGuess,
    getOpponentGuesses,
    addOpponentGuess,
  }
})
