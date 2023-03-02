import io from 'socket.io-client'

console.log(process)
let socket

if(process.dev){
    console.log('dev')
    socket = io('http://localhost:8000')
}else{
    console.log('prod')
    socket = io('https://ficfacfoe.onrender.com:8000')
}

export default defineNuxtPlugin(NuxtApp => {
    NuxtApp.provide('socket', socket)
    console.log('socket.io client plugin loaded')
})
