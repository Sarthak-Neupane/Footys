<template>
  <div class="h-screen grid content-center bg-green">
    <div class="container flex flex-col justify-center items-center gap-20 mx-auto">
      <logo-name class="font-black text-6xl" foe-color="blue"></logo-name>
      <div class="flex flex-col justify-center items-center gap-12 text-center text-3xl">
        <base-card background-back="lightWhite" background-front="blue" cursor="cursor-pointer" :group-hover=true
          group-name="group" :grounded=false> INSTRUCTIONS </base-card>
        <base-card background-back="lightWhite" background-front="blue" cursor="cursor-pointer" :group-hover=true
          group-name="group" :grounded=false @click="findAGame()"> PLAY ONLINE
        </base-card>
      </div>
    </div>
  </div>
  <div v-if="searching">
    <div class="fixed top-0 left-0 w-full h-full bg-lightBlack bg-opacity-90 z-50 flex justify-center items-center">
      <base-card class="py-7 px-20" background-back="lightWhite" background-front="blue" cursor="cursor-default"
        :groupHover="false" groupName="card" :grounded=false>
        <div class="flex flex-col justify-center items-center gap-14">
          <div class="text-3xl font-bold text-center"> {{ matchmakingText }} </div>
          <div class="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green" v-if="searching"></div>
          <base-card class="px-8 text-xl" background-back="lightWhite" background-front="green" :groupHover="true"
            groupName="group" :grounded=false @click="cancelSearch()"> CANCEL
          </base-card>
        </div>
      </base-card>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/store/';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router';

// state management and router
const store = useGameStore();
const $router = useRouter();

// registering plugins
const { $socket } = useNuxtApp()


// refs for matchmaking
const matchmakingText = ref('FINDING A GAME')
const searching = ref(null)
const joiningGameIn = ref(3)

// refs for custom lobby
const lobbyRoom = ref(null)


// set the player id if it doesn't exist
onBeforeMount(async () => {
  store.resetGame()
  if (localStorage.getItem('id') === null) {
    localStorage.setItem('id', uuidv4())
  }
  store.setCurrentPlayer(localStorage.getItem('id'))
})


// join the lobby for matchmaking
const findAGame = () => {
  searching.value = true;
  matchmakingText.value = 'FINDING A GAME'
  $socket.emit('joinLobby', { id: store.getCurrentPlayer })
}

// leave the lobby to cancel matchmaking
const cancelSearch = () => {
  searching.value = false;
  $socket.emit('leaveLobby', { id: store.getCurrentPlayer })
}

// SOCKET EVENTS STARTS
const socketEvents = () => {
  // check to see if the client has successfully joined the lobby 
  $socket.on('lobbyJoined', (data) => {
    console.log('joined lobby' + data)
    store.setCurrentSocketId(data.playerSocketId)
  })

  // check to see if the client has successfully exited the lobby
  $socket.on('lobbyLeft', () => {
    console.log('left lobby')
  })

  // check to see if the client has found a game. If yes, emit an event to join the game
  $socket.on('gameFound', (data) => {
    if (data.players.includes(store.getCurrentSocketId)) {
      matchmakingText.value = 'Game Found'
      $socket.emit('joinGame', { id: store.getCurrentPlayer, gameId: data.gameId })
    }
  })

  // check to see if the client has joined the game. If yes, set the game id into the store. 
  $socket.on('gameJoined', (data) => {

    // set the game id to the store.
    store.setGameId(data.gameId)
    matchmakingText.value = `Joining game...`

  })
  $socket.on('bothPlayersJoined', (data) => {
    console.log(data)
    if (data.isJoined) {

      const interval = setInterval(() => {
        console.log(joiningGameIn.value)
        if (joiningGameIn.value > 0) {
          matchmakingText.value = `Joining game in ${joiningGameIn.value}...`
          joiningGameIn.value -= 1
        } else {
          clearInterval(interval)
          $router.push(`/${store.gameId}`)
        }
      }, 1000)

    }
  })
}
// SOCKET EVENTS ENDS


// REGISTER SOCKET EVENTS IF THE SOCKET IS CONNECTED
if ($socket && $socket.connected) {
  console.log('connected')
  socketEvents()
} else {
  console.log('not connected')
}




// const getData = async () => {
//   const data = await $fetch('/api/Clubs/getClubs')
//   console.log(data)
// }
</script>