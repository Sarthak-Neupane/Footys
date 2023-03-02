import io from 'socket.io-client'

console.log(location.host)
// const socket = io(`${protocol}://${location.host}`)
const socket = io(`http://${location.host}:8000`)
// const socket = io(`http://0.0.0.0:3000`)

export default defineNuxtPlugin((NuxtApp) => {
    return {
        provide: {
            socket: socket
        }
    }
})