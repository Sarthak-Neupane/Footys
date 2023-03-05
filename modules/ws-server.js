import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
import { v4 as uuidv4 } from 'uuid'
import { defineNuxtModule } from '@nuxt/kit'

const randomNumber = (min, max, exclude) => {
  const number = Math.floor(Math.random() * (max - min + 1)) + min
  if (!exclude.includes(number)) {
    return number
  } else {
    return randomNumber(min, max, exclude)
  }
}

export default defineNuxtModule({
  setup (options, nuxt) {
    nuxt.hook('listen', async server => {
      const io = new Server(server)
        
      console.log(server)
    
      nuxt.hook('close', () => io.close())

      instrument(io, {
        auth: false,
        mode: 'development'
      })

      const findGame = () => {
        const clients = io.of('/').adapter.rooms.get('lobby')
        const numClients = [...(clients ? clients : 0)]
        if (numClients.length > 1) {
          const gameRoomId = uuidv4()
          const gameRoom = gameRoomId.replace(/-/g, '')

          io.to('lobby').emit('gameFound', {
            gameId: gameRoom,
            players: numClients
          })

        } else {
          console.log('no game found')
        }
      }

      io.on('connection', socket => {
        console.log(`${socket.id} connected`)

        socket.on('joinLobby', data => {
          joinLobby(socket, data)
        })
        socket.on('leaveLobby', data => {
          leaveLobby(socket)
        })
        socket.on('findGame', data => {
          findGame(socket, data)
        })
        socket.on('joinGame', data => {
          joinGame(socket, data)
        })
        socket.on('gameStart', data => {
          gameStart(socket, data)
        })
        socket.on('guess', data => {
          guess(socket, data)
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
          for (const room of socket.rooms) {
            if (room !== socket.id) {
              socket.to(room).emit('userLeft', socket.id)
            }
          }
        })
      })

      const joinLobby = (socket, data) => {
        socket.join('lobby')
        io.to(socket.id).emit('lobbyJoined', {
          id: data.id,
          playerSocketId: socket.id
        })
        findGame(socket)
      }

      const leaveLobby = socket => {
        socket.leave('lobby')
        io.to(socket.id).emit('lobbyLeft')
      }

      const joinGame = (socket, data) => {
        leaveLobby(socket)
        socket.join(data.gameId)
        io.to(data.gameId).emit('gameJoined', {
          gameId: data.gameId
        })
      }

      const gameStart = (socket, data) => {
        const clients = io.of('/').adapter.rooms.get(data.gameId)
        const numClients = [...(clients ? clients : 0)]
        const number = randomNumber(0, 1, [])
        io.to(data.gameId).emit('startGame', {
          player1: numClients[number],
          player2: numClients[number === 0 ? 1 : 0],
          color1: number === 0 ? 'green' : 'blue',
          color2: number === 0 ? 'blue' : 'green'
        })
      }

      const guess = (socket, data) => {
        socket.to(data.gameId).emit('guess', {
          guess: data.guess,
          player: data.id
        })
      }

      const gameDecided = (socket, data) => {
        if (data.winner) {
          io.to(data.gameId).emit('gameDecided', {
            winner: data.winner
          })
        } else {
          io.to(data.gameId).emit('gameDecided', {
            winner: null
          })
        }
      }

      const changeTurn = (socket, data) => {
        io.to(data.gameId).emit('changeTurn', {
          player: data.id
        })
      }

      const leaveRoom = (socket, data) => {
        socket.leave(data.gameId)
        io.to(socket.id).emit('roomLeft', {
          gameId: data.gameId
        })
      }

      io.of('/').adapter.on('join-room', async (room, id) => {
        if (room === 'lobby') {
        } else {
          const clients = io.of('/').adapter.rooms.get(room)
          // get the number of clients
          const numClients = [...(clients ? clients : 0)]
          // if there are two clients, start a game
          if (numClients.length === 2) {
            const data = await $fetch('/api/Clubs/getClubs')
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
    })
  }
})
