import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settings', () => {
  const name = ref('guest101')

  const setName = value => {
    name.value = value
  }

  const getName = computed(()=>{
    return name.value
  })

  return {
    setName,
    getName
  }
})
