<template>
  <ClientOnly>
    <base-error background-front="blue" v-if="socketError.value">
      You are already connected in other tab
  </base-error>
</ClientOnly>
  <div class="h-screen grid content-center bg-green">
    <div class="container flex flex-col justify-center items-center gap-20 mx-auto">
      <logo-name class="font-black text-6xl xl:text-8xl" foe-color="blue"></logo-name>
      <div class="flex flex-col justify-center items-center gap-12 text-center text-3xl">
        <nuxt-link to="/how-to-play">
          <base-card background-back="lightWhite" background-front="blue" cursor="cursor-pointer" :group-hover=true
            group-name="group" :grounded=false> INSTRUCTIONS </base-card> </nuxt-link>
        <base-card background-back="lightWhite" background-front="blue" cursor="cursor-pointer" :group-hover=true
          group-name="group" :grounded=false @click="findAGame()"> PLAY ONLINE
        </base-card>
      </div>
    </div>
    <div v-if="searching">
      <div class="fixed top-0 left-0 w-full h-full bg-lightBlack bg-opacity-90 z-50 flex justify-center items-center">
        <base-card class="py-7 px-20 aspect-square 2xl:w-2/5 2xl:h-2/5" background-back="lightWhite"
          background-front="blue" cursor="cursor-default" :groupHover="false" groupName="card" :grounded=false>
          <div class="flex flex-col justify-center items-center gap-14 2xl:w-full 2xl:h-full 2xl:justify-between">
            <div class="text-3xl font-bold text-center 2xl:text-5xl"> {{ matchmakingText }} </div>
            <div class="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green"></div>
            <base-card class="px-8 text-xl" background-back="lightWhite" background-front="green" :groupHover="true"
              groupName="group" :grounded=false @click="cancelSearch()" v-if="!gameFound"> CANCEL
            </base-card>
          </div>
        </base-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '~~/store/gameStore';
import { useGridStore } from '~~/store/gridStore';
import { useMainStore } from '~~/store/mainStore';
import { useTimerStore } from '~~/store/timerStore';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router';



// state management and router
const store = useGameStore();
const gridStore = useGridStore();
const mainStore = useMainStore();
const timerStore = useTimerStore();
const $router = useRouter();

// registering plugins
const { $socket } = useNuxtApp()

// refs for matchmaking
const matchmakingText = ref('FINDING A GAME')
const searching = ref(null)
const gameFound = ref(null)
const joiningGameIn = ref(3)
const timeout = ref(0)

// refs for socket errors
const socketError = reactive({
  value: false,
  message: ''
})

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
  if(socketError.value) return
  searching.value = true;
  gameFound.value = false;
  matchmakingText.value = 'FINDING A GAME'
  const delayTime = setTimeout(() => {
    $socket.emit('joinLobby', { id: store.getCurrentPlayer })
  }, 1000)
  timeout.value = delayTime
}

// leave the lobby to cancel matchmaking
const cancelSearch = () => {
  searching.value = false;
  gameFound.value = false;
  clearTimeout(timeout.value)
  $socket.emit('leaveLobby', { id: store.getCurrentPlayer })
}

// SOCKET EVENTS STARTS
const socketEvents = () => {
  // check to see if the client has successfully joined the lobby 
  $socket.on('lobbyJoined', (data) => {
    store.setCurrentSocketId(data.playerSocketId)
  })

  // check to see if the client has found a game. If yes, emit an event to join the game
  $socket.on('gameFound', (data) => {
    if (data.players.includes(store.getCurrentSocketId)) {
      matchmakingText.value = 'Game Found'
      gameFound.value = true
      $socket.emit('joinGame', { id: store.getCurrentPlayer, gameId: data.gameId })
    }
  })

  // check to see if the client has joined the game. If yes, set the game id into the store. 
  $socket.on('gameJoined', (data) => {
    matchmakingText.value = `Joining game...`
  })

  $socket.on('bothPlayersJoined', (data) => {
    if (data.isJoined) {
      const interval = setInterval(() => {
        if (joiningGameIn.value > 0) {
          matchmakingText.value = `Joining game in ${joiningGameIn.value}...`
          joiningGameIn.value -= 1
        } else {
          clearInterval(interval)
          joiningGameIn.value = 3
          // set the game id to the store.
          store.setGameId(data.gameId)

          // set the gameData to store
          gridStore.setColumnClubs(data.gameData.columnClubs)
          gridStore.setRowClubs(data.gameData.rowClubs) 

          $router.push(`/game/${store.gameId}`)
        }
      }, 1000)

    }
  })

  $socket.on('disconnect', () => {
    console.log('You have been disconnected')
  })
}

// SOCKET EVENTS ENDS
if ($socket) {
  if($socket.connected) {
    socketEvents()
  } else {
    socketError.value = true
    socketError.message = $socket.customError
  }
} else {
  // console.log('not instantiated')
}

</script>