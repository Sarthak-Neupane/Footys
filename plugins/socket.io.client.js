import io from 'socket.io-client'
let socket

    socket = io('http://localhost:8000')


export default defineNuxtPlugin(NuxtApp => {
    NuxtApp.provide('socket', socket)
    console.log('socket.io client plugin loaded')
})
