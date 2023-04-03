import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
import { v4 as uuidv4 } from 'uuid'

let io
let currentRooms = []
let connectedSockets = []
let connectedIds = []



const randomNumber = (min, max, exclude) => {
  const number = Math.floor(Math.random() * (max - min + 1)) + min
  if (!exclude.includes(number)) {
    return number
  } else {
    return randomNumber(min, max, exclude)
  }
}

const getExactRoom = gameId => {
  return currentRooms.find(room => room.id === gameId)
}

const getPlayerIdFromSocketId = socketId => {
  const player = connectedIds.find(player => player.socketId === socketId)
  return player.id
}

const registerTimer = (socket, data) => {
  const timer = setInterval(() => {
    io.to(data.gameId).emit('timer', {
      time: data.time
    })
    data.time--
    if (data.time < 0) {
      clearTimer(timer)
    }
  }, 1000)
  return timer
}

const clearTimer = timer => {
  clearInterval(timer)
}

export default defineEventHandler(({ node }) => {
  if (!io) {
    if (process.env.NODE_ENV === 'production') {
      io = new Server(node.res.socket.server, {
        cors: {
          origin: ['https://admin.socket.io', 'http://localhost:3000']
        }
      })
    } else {
      io = new Server(8000, {
        cors: {
          origin: ['http://localhost:3000', 'https://admin.socket.io']
        }
      })
    }
    instrument(io, {
      auth: false,
      mode: 'development'
    })

    const findGame = () => {
      const clients = io.of('/').adapter.rooms.get('lobby')
      // get the number of clients in the room

      const numClients = [...(clients ? clients : 0)]
      if (numClients.length > 1) {
        const gameRoomId = uuidv4()
        const gameRoom = gameRoomId.replace(/-/g, '')

        io?.to('lobby').emit('gameFound', {
          gameId: gameRoom,
          players: numClients
        })
      } else {
        // console.log('no game found')
      }
    }

    io.use((socket, next) => {
      const customId = socket.handshake.auth.id
      if (!customId) {
        return next(new Error('invalid id'))
      }
      socket.customId = customId
      next()
    })

    io.use(async (socket, next) => {
      if (connectedSockets.includes(socket.customId)) {
        return next(new Error('Already Connected, Please Close Connected Tabs'))
      }
      next()
    })

    io.on('connection', async socket => {
      connectedSockets.push(socket.customId)
      connectedIds.push({
        id: socket.customId,
        socketId: socket.id
      })
      console.log('connected sockets', connectedIds)

      socket.on('joinLobby', data => {
        joinLobby(socket, data)
      })
      socket.on('leaveLobby', data => {
        leaveLobby(socket)
      })
      socket.on('findGame', data => {
        findGame()
      })
      socket.on('joinGame', data => {
        joinGame(socket, data)
      })
      socket.on('gameStart', data => {
        gameStart(socket, data)
      })
      socket.on('ready', data => {
        const exactRoom = getExactRoom(data.gameId)
        if (data.playerTurn) {
          exactRoom.playersReady[0] = true
        } else {
          exactRoom.playersReady[1] = true
        }
        if (exactRoom.playersReady[0] && exactRoom.playersReady[1]) {
          exactRoom.timer = registerTimer(socket, {
            gameId: data.gameId,
            time: 30
          })
        }
      })
      socket.on('checkAnswer', data => {
        const exactRoom = getExactRoom(data.gameId)
        clearTimer(exactRoom.timer)
        checkAnswer(socket, data)
      })
      socket.on('changeTurn', data => {
        changeTurn(socket, data)
      })
      socket.on('gameDecided', data => {
        gameDecided(socket, data)
      })
      socket.on('leaveRoom', data => {
        leaveRoom(socket, data)
      })
      socket.on('userLeft', data => {
        socket.leave(data.gameId)
        socket.to(data.gameId).emit('userLeft', socket.id)
      })
      socket.on('disconnecting', reason => {
        console.log(`${socket.customId} disconnecting`)
        connectedSockets = connectedSockets.filter(s => s !== socket.customId)
        connectedIds = connectedIds.filter(s => s.id !== socket.customId)
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            socket.to(room).emit('userLeft', socket.id)
          }
        }
      })
      socket.on('disconnected', reason => {
        console.log(`${socket.customId} disconnected`)
      })
    })

    const joinLobby = (socket, data) => {
      socket.join('lobby')
      io?.to(socket.id).emit('lobbyJoined', {
        id: data.id,
        playerSocketId: socket.id
      })
      findGame()
    }

    const leaveLobby = socket => {
      socket.leave('lobby')
      io?.to(socket.id).emit('lobbyLeft')
    }

    const joinGame = (socket, data) => {
      leaveLobby(socket)
      socket.join(data.gameId)
      io?.to(data.gameId).emit('gameJoined', {
        gameId: data.gameId
      })
    }

    const gameStart = (socket, data) => {
      const clients = io?.of('/').adapter.rooms.get(data.gameId)
      const numClients = [...(clients ? clients : 0)]
      const number = randomNumber(0, 1, [])
      io?.to(data.gameId).emit('startGame', {
        player1: numClients[number],
        player2: numClients[number === 0 ? 1 : 0],
        color1: number === 0 ? 'green' : 'blue',
        color2: number === 0 ? 'blue' : 'green'
      })
    }

    const checkAnswer = async (socket, data) => {
      const getData = await $fetch(`/api/Game/gameData/${data.gameId}`, {
        method: 'GET'
      })
      socket.to(data.gameId).emit('guess', {
        guess: data.answer,
        player: data.id
      })
    }

    const gameDecided = (socket, data) => {
      if (data.winner) {
        io?.to(data.gameId).emit('gameDecided', {
          winner: data.winner
        })
      } else {
        io?.to(data.gameId).emit('gameDecided', {
          winner: null
        })
      }
    }

    const changeTurn = (socket, data) => {
      io?.to(data.gameId).emit('changeTurn', {
        player: data.id
      })
      const exactRoom = getExactRoom(data.gameId)
      exactRoom.timer = registerTimer(socket, {
        gameId: data.gameId,
        time: 30
      })
    }

    const leaveRoom = (socket, data) => {
      socket.leave(data.gameId)
      io?.to(socket.id).emit('roomLeft', {
        gameId: data.gameId
      })
    }

    io?.of('/').adapter.on('join-room', async (room, id) => {
      if (room === 'lobby') {
      } else {
        const clients = io?.of('/').adapter.rooms.get(room)
        // get the number of clients
        const numClients = [...(clients ? clients : 0)]
        // if there are two clients, start a game
        if (numClients.length >= 2) {
          const data = await $fetch('/api/Game/getData')
          const postedData = await $fetch(`/api/Game/gameData/${room}`, {
            method: 'POST',
            body: {
              gameId: room,
              socketIds: [numClients[0], numClients[1]],
              playerIds: [getPlayerIdFromSocketId(numClients[0]), getPlayerIdFromSocketId(numClients[1])],
              gameData: {
                columnClubs: data.initialClubs,
                rowClubs: data.secondaryClubs,
                matches: data.matches
              }
            }
          })
          currentRooms.push({
            id: room,
            playerIds: [getPlayerIdFromSocketId(numClients[0]), getPlayerIdFromSocketId(numClients[1])],
            socketIds: [numClients[0], numClients[1]],
            playersReady: [false, false],
            timer: null,
            gameData: {
              columnClubs: data.initialClubs,
              rowClubs: data.secondaryClubs,
              matches: data.matches
            }
          })
          io.to(room).emit('bothPlayersJoined', {
            gameId: room,
            isJoined: true,
            gameData: {
              columnClubs: data.initialClubs,
              rowClubs: data.secondaryClubs,
              matches: data.matches
            }
          })
        }
      }
    })
  }
})
