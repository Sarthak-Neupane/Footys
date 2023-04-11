import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settings', () => {
  const name = ref(localStorage?.getItem('name') || 'guest101')

  const setName = (value) => {
    name.value = value
    localStorage.setItem('name', value)
  }

  const getName = computed(()=>{
    return name.value
  })

  return {
    setName,
    getName
  }
})
