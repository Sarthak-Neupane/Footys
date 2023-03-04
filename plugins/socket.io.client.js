import io from 'socket.io-client'

const socket = io()

export default defineNuxtPlugin(NuxtApp => {
    NuxtApp.provide('socket', socket)
})
