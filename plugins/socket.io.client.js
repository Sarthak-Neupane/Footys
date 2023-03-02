import io from 'socket.io-client'

console.log(location.host)
// const socket = io(`${protocol}://${location.host}`)
// const socket = io(`https://${location.host}:10000`)
// const socket = io(`http://0.0.0.0:3000`)
// const socket = io('http://0.0.0.0:10000')

const socket = io('http://localhost:8000')

export default defineNuxtPlugin((NuxtApp) => {
    return {
        provide: {
            socket: socket
        }
    }
})