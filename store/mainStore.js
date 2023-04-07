import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  const myTurn = ref(null)
  const myColor = ref(null)
  const opponentColor = ref(null)
  const myId = ref(null)
  const mySocketId = ref(null)

  const setMyId = id => {
    myId.value = id
  }

  const getMyId = computed(() => {
    return myId.value
  })

  const setMySocketId = id => {
    mySocketId.value = id
  }

  const getMySocketId = computed(() => {
    return mySocketId.value
  })

  const setMyColor = color => {
    myColor.value = color
  }

  const getMyColor = computed(() => {
    return myColor.value
  })

  const setOpponentColor = color => {
    opponentColor.value = color
  }

  const getOpponentColor = computed(() => {
    return opponentColor.value
  })

  const setMyTurn = turn => {
    myTurn.value = turn
  }

  const getMyTurn = computed(() => {
    return myTurn.value
  })

  const changeTurns = () => {
    setTimeout(() => {
      myTurn.value = !myTurn.value
    }, 1000)
  }

  return {
    setMyId,
    getMyId,
    setMySocketId,
    getMySocketId,
    setMyColor,
    getMyColor,
    setOpponentColor,
    getOpponentColor,
    setMyTurn,
    getMyTurn,
    changeTurns
  }
})
