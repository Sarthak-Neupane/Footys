import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

export default defineNuxtPlugin(NuxtApp => {
  const config = useRuntimeConfig()

  let socket
  let socketError
  let customId = localStorage.getItem('id')

  console.log(customId)

  if (!customId) {
    customId = uuidv4()
  }

  if (config.public.environment === 'production') {
    socket = io({
      auth: {
        id: customId
      }
    })
  } else {
    socket = io('http://localhost:8000', {
      auth: {
        id: customId
      }
    })
  }

  socket.on('connect', () => {
    console.log('connected')
    socketError = null
    socket.customError = null
  })

  socket.on('connect_error', err => {
    socketError = err.message
    socket.customError = socketError
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
  })

  socket.on('reconnect', () => {
    console.log('reconnected')
  })

  socket.on('reconnect_attempt', () => {
    console.log('reconnect_attempt')
  })

  socket.on('reconnecting', () => {
    console.log('reconnecting')
  })

  socket.on('reconnect_error', () => {
    console.log('reconnect_error')
  })

  socket.on('reconnect_failed', () => {
    console.log('reconnect_failed')
  })

  return {
    provide: {
      socket: socket,
    }
  }
})
