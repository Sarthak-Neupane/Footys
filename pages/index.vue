<template>
  <ClientOnly>
    <base-error background-front="blue" v-if="error.value">
      {{ error.message }}
  </base-error>
</ClientOnly>
  <div class="h-screen grid content-center bg-green relative">
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
    <Teleport to="body" v-if="searching">
      <PlayAgain @cancel-join="cancelSearch" @user-left="userLeft" :action="action">
      </PlayAgain>
    </Teleport>
    <div class="absolute bottom-0 left-0 w-full h-0 bg-lightBlack opacity-75" ref="overlay"></div>
  </div>
</template>

<script setup>
import { useMainStore } from '~~/store/mainStore';
import { v4 as uuidv4 } from 'uuid';

const overlay = ref(null)

// state management and router
const mainStore = useMainStore();

// registering plugins
const { $socket } = useNuxtApp()

// refs for matchmaking
const searching = ref(false)
const action = ref(false)


const error = reactive({
  value: false,
  message: ''
})

// set the player id if it doesn't exist
onBeforeMount(async () => {
  if (localStorage.getItem('id') === null) {
    localStorage.setItem('id', uuidv4())
  }
  mainStore.setMyId(localStorage.getItem('id'))
})

// join the lobby for matchmaking
const findAGame = () => {
  if(error.value) return
  searching.value = true;
  action.value = true;
  overlay.value.classList.remove('h-0')
  overlay.value.classList.add('h-full')
}

// leave the lobby to cancel matchmaking
const cancelSearch = () => {
  searching.value = false;
  action.value = false;
  overlay.value.classList.remove('h-full')
  overlay.value.classList.add('h-0')
}

const userLeft = () => {
  searching.value = false;
  action.value = false;
  error.value = true
  error.message = 'The other player left the room'
  overlay.value.classList.remove('h-full')
  overlay.value.classList.add('h-0')
  setTimeout(() => {
    error.value = false
    error.message = ''
  }, 3000)
}

// SOCKET EVENTS STARTS
const socketEvents = () => {
  $socket.on('disconnect', () => {
    console.log('You have been disconnected')
  })
}

// SOCKET EVENTS ENDS
if ($socket) {
  if($socket.connected) {
    socketEvents()
    error.value = false
    error.message = ''
  } else {
    error.value = true
    error.message = $socket.customError
  }
} else {
  // console.log('not instantiated')
}

</script>