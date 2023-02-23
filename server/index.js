import mongoose from 'mongoose'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'


const randomNumber = (min, max, exclude) => {
  const number = Math.floor(Math.random() * (max - min + 1)) + min
  if (!exclude.includes(number)) {
    return number
  } else {
    return randomNumber(min, max, exclude)
  }
}

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
    socket.on('join', (data) => {
      join(socket, data)
    })
    socket.on('guess', (data) => {
      guess(socket, data)
    })
    socket.on('changeTurn', (data)=>{
      io.to('gameRoom').emit('changeTurn', {
        player: data.id
      })
    })
    socket.on('gameDecided', (data)=>{
      if(data.winner){
        io.to('gameRoom').emit('gameDecided', {
          winner: data.winner
        })
      } else {
        io.to('gameRoom').emit('gameDecided', {
          winner: null
        })
      }
    })
  })

  const join = (socket, data) => {
    socket.join('gameRoom')
  }

  const guess = (socket, data) => {
    socket.to('gameRoom').emit('guess', {
      guess: data.guess,
      player: data.id
    })
  }

  io.of("/").adapter.on("create-room", (room) => {
    if(room === 'gameRoom'){
      console.log(`room ${room} was created`);
    }
  });

  io.of("/").adapter.on("join-room", (room, id) => {
    if(room === 'gameRoom'){
      // get all the socket in room
      const clients = io.of("/").adapter.rooms.get(room);
      // get the number of clients
      const numClients = [...clients ? clients : 0];
      // if there are 2 clients in the room, start the game
      if(numClients.length === 2){
        const number = randomNumber(0, 1, [])
        io.to('gameRoom').emit('startGame', {
          player1: numClients[number],
          player2: numClients[number === 0 ? 1 : 0]
        })
      }
    }
  });

  httpServer.listen(8000)
}
