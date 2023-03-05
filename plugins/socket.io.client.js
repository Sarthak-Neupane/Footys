import io from 'socket.io-client'

// const config = useRuntimeConfig()
// const socket = io('http://localhost:8000')

export default defineNuxtPlugin(NuxtApp => {

    // const config = useRuntimeConfig()
    const socket = io()
    NuxtApp.provide('socket', socket)
})
