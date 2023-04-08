import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const gameId = ref(null)
  const gameEnd = ref(false)
  const gameResult = ref(false)
  const winner = ref(null)

  const setGameId = id => {
    gameId.value = id
  }

  const getGameId = computed(() => {
    return gameId.value
  })

  const setGameEnd = () => {
    gameEnd.value = true
  }

  const getGameEnd = computed(() => {
    return gameEnd.value
  })

  const setGameResult = (r, w) => {
    if(r === 'draw') {
      gameResult.value = 'draw'
      winner.value = 'draw'
    } else {
      gameResult.value = r
      winner.value = w
    }
  }

  const getGameResult = computed(() => {
    return gameResult.value
  })

  const getWinner = computed(() => {
    return winner.value
  })

  const reset = () => {
    gameId.value = null
    gameEnd.value = false
    gameResult.value = false
    winner.value = null
  }

  return {
    setGameId,
    getGameId,
    gameEnd,
    setGameEnd,
    getGameEnd,
    setGameResult,
    getGameResult,
    getWinner,
    reset
  }
})
