import io from 'socket.io-client'

export default defineNuxtPlugin(NuxtApp => {
  const config = useRuntimeConfig()

  if (config.public.environment === 'production') {
    const socket = io()  // this is for prod
    console.log('inside plugin')
    NuxtApp.provide('socket', socket)
  } else {
    const socket = io('http://localhost:8000') // this is for dev
    console.log('inside plugin')
    NuxtApp.provide('socket', socket)
  }
})
