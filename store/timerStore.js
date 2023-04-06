import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', () => {
  const timer = ref(30)

  const setTimer = e => {
    timer.value = e
  }

  const getTimer = () => {
    return timer.value
    }

  return {
    setTimer,
    getTimer
  }
})
