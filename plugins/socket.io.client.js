import io from 'socket.io-client'

const config = useRuntimeConfig()
const socket = io(config.baseUrl)

export default defineNuxtPlugin(NuxtApp => {
    NuxtApp.provide('socket', socket)
})
