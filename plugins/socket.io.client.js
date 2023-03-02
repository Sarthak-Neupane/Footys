import io from 'socket.io-client'
const socket = io(`https://ficfacfoe.onrender.com:8000`, {})

export default defineNuxtPlugin((NuxtApp) => {
    return {
        provide: {
            socket: socket
        }
    }
})