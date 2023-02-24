import io from 'socket.io-client'
const socket = io('https://ficfacfoe.vercel.app', {})

export default defineNuxtPlugin((NuxtApp) => {
    return {
        provide: {
            socket: socket
        }
    }
})