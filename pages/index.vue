<template>
  <div class="h-screen grid content-center">
    <div class="container sm:bg-darkWhite flex flex-col justify-center items-center gap-20 mx-auto">
      <logo-name class="font-black text-6xl"></logo-name>
      <div class="flex flex-col justify-center items-center gap-8 text-center text-3xl">
        <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg w-60 py-2"> How To Play
        </base-button>
        <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg w-60 py-2"
          @click="findAGame()">
          Play Online
        </base-button>
        <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg w-60 py-2"> Play A Friend
        </base-button>
      </div>
    </div>
  </div>
  <div v-if="searching">
    <div class="fixed top-0 left-0 w-full h-full bg-lightBlack bg-opacity-90 z-50 flex justify-center items-center">
      <div
        class="flex flex-col justify-center items-center bg-darkWhite gap-8 py-8 px-7 rounded-md border-2 border-solid border-x-green border-y-blue">
        <div class="text-3xl font-bold text-center"> {{ matchmakingText  }} </div>
        <div class="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green" v-if="searching"></div>
        <base-button class="bg-none text-lightBlack font-medium border-solid border-blue border-2 rounded-lg w-60 py-2">
          Cancel </base-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/store/';
import { v4 as uuidv4 } from 'uuid';
import { useRoute, useRouter } from 'vue-router';

const { $socket } = useNuxtApp()
const store = useGameStore();
const $router = useRouter();
const $route = useRoute();

const matchmakingText = ref('Finding a game...')
const searching = ref(null)
const joiningGameIn = ref(3)

onBeforeMount(async () => {
  if (localStorage.getItem('id') === null) {
    localStorage.setItem('id', uuidv4())
  }
  store.setCurrentPlayer(localStorage.getItem('id'))
})

const findAGame = () => {
  searching.value = true;
  matchmakingText.value = 'Finding a game...'
  $socket.emit('joinLobby', { id: store.getCurrentPlayer })
}

watch( joiningGameIn, (current, previous)=>{
  if(current === 0) {
    $router.push(`/${store.gameId}`)
  }
})

if ($socket && $socket.connected) {
  console.log('connected')
  
  $socket.on('lobbyJoined', (data) => {
    console.log('joined lobby' + data)
  })
  $socket.on('lobbyLeft', () => {
    console.log('left lobby')
  })

  $socket.on('gameFound', (data) => {
    matchmakingText.value = 'Game Found'
    $socket.emit('joinGame', { id: store.getCurrentPlayer, gameId: data.gameId })
  })

  $socket.on('gameJoined', (data) => {
    store.setGameId(data.gameId)
    
    setInterval(() => {
      if (joiningGameIn.value > 0) {
        matchmakingText.value = `Joining game in ${joiningGameIn.value}...`
        joiningGameIn.value--
      } else {
        clearInterval()
      }
    }, 1000)
  })

} else {
  console.log('not connected')
}

const getData = async () => {
  const data = await $fetch('/api/Clubs/getClubs')
  console.log(data)
}
</script>