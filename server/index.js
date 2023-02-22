import mongoose from 'mongoose'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

export default async _nitroApp => {
  const config = useRuntimeConfig()
  try {
    await mongoose.connect(config.mongodbURI)
    console.log('connected to mongo db')
  } catch (e) {
    console.log(e)
  }

  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:8000']
    }
  })

  io.on('connection', socket => {
    console.log(`${socket.id} connected`)
    socket.on('join', join)
  })

  const join = (socket, payload) => {
    socket.join('bfc88aea-a96e-45b1-b715-1f242fc39de3')
    console.log(payload.id + ' joined')
  }

  httpServer.listen(8000)
}
