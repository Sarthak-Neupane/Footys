import { defineStore } from 'pinia'
// import { useStorage } from '@vueuse/core'
// import { v4 as uuidv4 } from 'uuid'

export const useGameStore = defineStore('game', () => {
  const gameId = ref(null)
  const gameEnd = ref(false)
  const gameResult = ref(false)
  const winner = ref(null)
  const currentPlayer = ref('id')
  const currentSocketId = ref(null)
  const playerColor = ref(null)
  const opponentColor = ref(null)
  const playerTurn = ref(null)
  const playerGuesses = ref([])
  const opponenetGuesses = ref([])

  const intervalId = ref(null)

  const timer = ref(30)

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
  const getCurrentSocketId = computed(() => {
    return currentSocketId.value
  })
  const setCurrentSocketId = id => {
    currentSocketId.value = id
  }

  const getPlayerColor = computed(() => {
    // return playerColor.value
  })
  const getOpponentColor = computed(() => {
    // return opponentColor.value
  })
  const setPlayerColor = (color) => {
    // playerColor.value = color
    // opponentColor.value = (color) === 'green' ? 'blue' : 'green'
  }

  const setInitialPlayerTurn = e => {
    // playerTurn.value = e
  }
  const changePlayerTurn = (e) => {
    // if(e.player === currentPlayer.value) {
    //   playerTurn.value = false
    // } else {
    //   playerTurn.value = true
    // }
  }
  
  const getPlayerGuesses = computed(() => {
    // return playerGuesses.value
  })
  const addPlayerGuess = guess => {
    // playerGuesses.value.push(guess)
  }
  
  const getOpponentGuesses = computed(() => {
    // return opponenetGuesses.value
  })
  const addOpponentGuess = guess => {
    // opponenetGuesses.value.push(guess)
  }

  const getTimer = computed(() => {
    // return timer.value
  })

  const setTimer = (e) => {
    // timer.value = e
  }

  const resetGame = () => {
    gameId.value = null
    gameEnd.value = false
    gameResult.value = false
    winner.value = null
    currentPlayer.value = localStorage.getItem('id')
    playerColor.value = null
    opponentColor.value = null
    playerTurn.value = true
    playerGuesses.value = []
    opponenetGuesses.value = []
    timer.value = 30
    clearInterval(intervalId.value)
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
    getCurrentSocketId,
    setCurrentSocketId,
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
    getTimer,
    setTimer,
    resetGame
  }
})
