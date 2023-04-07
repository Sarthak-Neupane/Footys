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
    <Teleport to="body" v-if="searching">
      <PlayAgain @cancel-join="cancelSearch" :action="action">
      </PlayAgain>
    </Teleport>
  </div>
</template>

<script setup>
import { useMainStore } from '~~/store/mainStore';
import { v4 as uuidv4 } from 'uuid';



// state management and router
const mainStore = useMainStore();

// registering plugins
const { $socket } = useNuxtApp()

// refs for matchmaking
const searching = ref(null)
const action = ref(false)

// refs for socket errors
const socketError = reactive({
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
  if(socketError.value) return
  searching.value = true;
  action.value = true;
}

// leave the lobby to cancel matchmaking
const cancelSearch = () => {
  searching.value = false;
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
  } else {
    socketError.value = true
    socketError.message = $socket.customError
  }
} else {
  // console.log('not instantiated')
}

</script>