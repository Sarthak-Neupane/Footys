import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  const myTurn = ref()
  const myColor = ref()
  const opponentColor = ref()
  const myId = ref()

  const setMyId = id => {
    myId.value = id
  }

  const getMyId = () => {
    return myId.value
  }

  const setMyColor = color => {
    myColor.value = color
  }

  const getMyColor = () => {
    return myColor.value
  }

  const setOpponentColor = color => {
    opponentColor.value = color
  }

  const getOpponentColor = () => {
    return opponentColor.value
  }

  const setMyTurn = turn => {
    myTurn.value = turn
  }

  const getMyTurn = () => {
    return myTurn.value
  }

  const changeTurns = () => {
    myTurn.value = !myTurn.value
  }

  return {
    setMyId,
    getMyId,
    setMyColor,
    getMyColor,
    setOpponentColor,
    getOpponentColor,
    setMyTurn,
    getMyTurn,
    changeTurns
  }
})
