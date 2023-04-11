import { defineStore } from 'pinia'

export const useGridStore = defineStore('grid', () => {
  const columnClubs = ref([])
  const rowClubs = ref([])
  const allAnswers = ref([])
  const currentAnswer = ref()
  const playerIndexes = ref([])
  const opponentIndexes = ref([])

  const setColumnClubs = clubs => {
    columnClubs.value = clubs
  }

  const setRowClubs = clubs => {
    rowClubs.value = clubs
  }

  const setCurrentAnswer = answer => {
    currentAnswer.value = answer
    allAnswers.value.push(answer)

    if (answer.result.index !== null) {
      if (answer.meta.player === localStorage.getItem('id')) {
        setPlayerIndex(answer.result.index)
      } else {
        setOpponentIndex(answer.result.index)
      }
    }
  }

  const setPlayerIndex = index => {
    // console.log('index', index)
    playerIndexes.value.push(index)
  }

  const setOpponentIndex = index => {
    // console.log('index', index)
    opponentIndexes.value.push(index)
  }

  const getGridFull = computed(() => {
    return playerIndexes.value.length + opponentIndexes.value.length === 9
  })

  const reset = () => {
    allAnswers.value = []
    currentAnswer.value = null
    playerIndexes.value = []
    opponentIndexes.value = []
  }

  return {
    columnClubs,
    rowClubs,
    setColumnClubs,
    setRowClubs,
    currentAnswer,
    setCurrentAnswer,
    allAnswers,
    playerIndexes,
    setPlayerIndex,
    opponentIndexes,
    setOpponentIndex,
    getGridFull,
    reset
  }
})
