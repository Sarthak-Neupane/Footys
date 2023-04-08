<template>
  <Transition name="fade"
    class="fixed top-0 left-0 w-screen h-full bg-lightBlack bg-opacity-90 z-50 flex justify-center items-center">
    <div class="w-full absolute top-0 left-0" v-if="playerWantingToLeave">
      <base-card class="py-7 px-20" background-back="lightWhite" background-front="blue" cursor="cursor-default"
        :groupHover="false" groupName="card" :grounded=false>
        <div class=" flex flex-col justify-center items-center gap-10 w-full">
          <h1>Are you sure, you want to forfeit the match ?</h1>
          <div class="flex w-full justify-around items-center">
            <base-card class="px-8 text-xl" background-back="lightWhite" background-front="green" :groupHover="true"
              groupName="group" :grounded=false @click="leaveGame()"> YES
            </base-card>
            <base-card class="px-8 text-xl" background-back="lightWhite" background-front="green" :groupHover="true"
              groupName="group" :grounded=false @click="dontLeaveGame()"> NO
            </base-card>
          </div>
        </div>
      </base-card>
    </div>
  </Transition>
  <Teleport to="body" v-if="searching">
    <PlayAgain @cancel-join="cancelSearch" @user-left="userLeft" :action="action">
    </PlayAgain>
  </Teleport>
  <Transition name="fade">
    <div v-if="gameNotStarted" class="fixed top-0 left-0 w-full h-screen bg-green z-50 flex justify-center items-center">
      <base-card class="py-7 px-20" background-back="lightWhite" background-front="blue" cursor="cursor-default"
        :groupHover="false" groupName="card" :grounded=false>
        <div class="flex flex-col justify-center items-center gap-14">
          <div class="text-3xl font-bold text-center"> Game Starts In {{ gameStartsIn }} </div>
        </div>
      </base-card>
    </div>
    <div class="min-h-screen bg-lightWhite relative" ref="page" v-else>
      <Transition name="earlyFade">
        <div class=" w-1/2 absolute z-10 top-5 left-1/2 -translate-y-0 -translate-x-1/2">
          <base-card v-if="opponentLeft || error.value" class="" background-back="lightWhite"
            :background-front="mainStore.getOpponentColor" cursor="cursor-default" :group-hover=false group-name="card"
            :grounded=false>
            {{ error.message }} </base-card>
        </div>
      </Transition>
      <canvas class="h-screen w-screen max-h-screen max-w-full absolute bottom-0 left-0 pointer-events-none"
        ref="canvas"></canvas>
      <div class="border-b-[1px] border-solid border-lightBlack w-full text-center py-4 md:py-6"
        :class="`bg-${mainStore.getMyColor}`">
        <logo-name class="font-black text-4xl" :foe-color="mainStore.getOpponentColor"
          @click-logo="clickLogo()"></logo-name>
      </div>
      <div
        class="container md:py-5 sm:w-3/4 md:w-4/5 lg:w-4/6 my-0 mx-auto h-full flex flex-col justify-start items-center">
        <div class="w-full px-6 flex flex-col md:flex-row justify-center items-center gap-7 md:gap-12">
          <div class="w-full flex flex-col justify-center items-center gap-8 md:gap-12">
            <tryGrid ref="grid"></tryGrid>
            <transition name="fade" mode="out-in" appear>
              <div class="relative w-full md:w-full flex justify-center items-center" v-if="!getGameEnd">
                <Transition name="fade" mode="out-in" appear>
                  <div v-if="getMyTurn">
                    <SearchBar @submit-answer="sendGuessToEmit" />
                  </div>
                </Transition>
              </div>
              <div class="w-full flex flex-col justify-center items-center gap-5" v-else>
                <action-buttons :error="error.value" @new-game="findAGame()"></action-buttons>
              </div>
            </transition>
          </div>
          <div class="w-full h-full flex flex-col justify-between items-center gap-7 md:gap-10 lg:gap-14">
            <Transition name="fade" mode="out-in">
              <TurnInfo v-if="!getGameEnd" :get-my-turn="getMyTurn"
                class="flex flex-col justify-center items-center gap-5 md:gap-8 lg:gap-12 w-full"></TurnInfo>
              <GameResult v-else></GameResult>
            </Transition>
            <div class="w-full sm:w-3/4 flex justify-between items-center">
              <PlayerGuesses />
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 w-full h-0 bg-lightBlack opacity-75" ref="overlay"></div>
    </div>
  </Transition>
</template>
  
<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '~~/store/gameStore'
import { useMainStore } from '~~/store/mainStore'
import { useGridStore } from '~~/store/gridStore'
import { v4 as uuidv4 } from 'uuid'
import { useRouter, useRoute } from 'vue-router';
import { useTimerStore } from '~~/store/timerStore'

// refs for play again
const searching = ref(false)
const action = ref(false)
const overlay = ref(false)
const error = reactive({ value: false, message: '' })

// register refs for the waiting
const gameNotStarted = ref(true)
const gameStartsIn = ref(3)

// register game store and router
const store = useGameStore()
const { getGameEnd } = storeToRefs(store)

const mainStore = useMainStore()
const { getMyTurn } = storeToRefs(mainStore)

const gridStore = useGridStore()

// const resetAllStore = () => {
//   store.reset()
//   mainStore.reset()
//   gridStore.reset()
//   useTimerStore().reset()
// }

const $router = useRouter()
const $route = useRoute()


// register plugins
const { $confetti } = useNuxtApp()
const { $socket } = useNuxtApp()

// page meta
definePageMeta({
  title: 'Game',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: 'Game page'
    }
  ],
  validate: async (route) => {
    if (useGameStore().getGameId == null || useGameStore().getGameId == undefined || route.params.gameId != useGameStore().getGameId) {
      return false
    } else {
      useGameStore().reset()
      useGridStore().reset()
      useMainStore().reset()
      useTimerStore().reset()
      return true
    }
  },
})


// REGISTERING REFS

// the grid ref
const grid = ref()

// refs for player leaving a game prematurely
const opponentLeft = ref(false)
const playerWantingToLeave = ref(false)
const playerDecidedToLeave = ref(null)


// instantiate a null player
const player = ref(null)

// ref for the confetti canvas
const canvas = ref(null)
// REGISTERING REFS ENDS ---------


// Lifecycle Hooks ----------------------------------------------
// set the player id before the component is mounted
onBeforeMount(async () => {
  console.log($route.params.gameId)
  const interval = setInterval(() => {
    if (gameStartsIn.value > 0) {
      gameStartsIn.value--
    } else {
      gameNotStarted.value = false
      $socket.emit('start', { id: player.value, gameId: store.getGameId, playerTurn: mainStore.getMyTurn })
      clearInterval(interval)
    }
  }, 1000)

  // check if the player has a local storage id
  if (localStorage.getItem('id')) {
    player.value = localStorage.getItem('id')
  } else {
    player.value = uuidv4()
    localStorage.setItem('id', player.value)
  }
  $socket.emit('ready', { id: player.value, gameId: $route.params.gameId }, (data) => {

    store.setGameId($route.params.gameId)
    // set the gameData to store
    gridStore.setColumnClubs(data.columnClubs)
    gridStore.setRowClubs(data.rowClubs)

    if (data.player1 === $socket.id) {
      mainStore.setMyTurn(true)
      mainStore.setMyColor(data.color1)
      mainStore.setOpponentColor(data.color2)
    } else {
      mainStore.setMyTurn(false)
      mainStore.setMyColor(data.color2)
      mainStore.setOpponentColor(data.color1)
    }
  })
})

onBeforeRouteLeave((to, from, next) => {
  if (!store.getGameEnd && !opponentLeft.value && store.getGameId != null) {
    playerWantingToLeave.value = true
    if (playerDecidedToLeave.value != null) {
      if (playerDecidedToLeave.value === true) {
        if (!store.getGameEnd && !opponentLeft.value && store.getGameId != null) {
          console.log('emitting user left')
          next()
        }
      } else {
        // console.log('not leaving')
        next(false)
      }
    } else {
      // console.log('not leaving second')
      next(false)
    }
  } else {
    // console.log('Ok leaving')
    next()
  }
})

// onUnmounted(() => {
//   resetAllStore()
// })

// LIFECYCLE HOOKS ENDS -----------------------------------------

// WATCHERS START ------------------------------------------------
watch(playerDecidedToLeave, (current, previous) => {
  if (current === true) {
    if (!store.getGameEnd && !opponentLeft.value && store.getGameId != null) {
      // console.log('emitting user left and pushing to home')
      $socket.emit('userLeft', { id: player.value, gameId: store.getGameId }, (data) => {
        console.log(data)
        console.log('user left')
      })
      $router.push('/')
    } else {
      // console.log('pushing to home')
      $router.push('/')
    }
  } else {
    // console.log('not leaving')
  }
})
// WATCHERS END --------------------------------------------------

// METHODS STARTS -------------------------------------------------
// method to go to home page
const clickLogo = () => {
  $router.push('/')
}

const leaveGame = () => {
  playerDecidedToLeave.value = true
}

const dontLeaveGame = () => {
  playerWantingToLeave.value = false
  playerDecidedToLeave.value = false
}



// send the guess to server and grid. After the 'submit-answer' event is emitted by the searchBar component
const sendGuessToEmit = async (e) => {
  if (!getMyTurn.value) return
  $socket.emit('checkAnswer', {
    answer: {
      ...e,
    }, id: player.value, gameId: store.getGameId
  })
}

gridStore.$subscribe((mut, state) => {
  if(!gridStore.currentAnswer) return
  if (store.getGameEnd) return
  console.log('grid store changed', store.getGameEnd)
  $socket.emit('changeTurns', { gameId: store.getGameId }, (data) => {
    console.log('changed turns', data)
    if (player.value === data.currentTurn) {
      mainStore.setMyTurn(true)
    } else {
      mainStore.setMyTurn(false)
    }
  })
})


// SOCKET EVENTS STARTS ----------------------------
const socketEvents = () => {
  // INITIAL GAME SOCKET EVENTS STARTS
  $socket.on('timer', (e) => {
    useTimerStore().setTimer(e.time)
  })

  // send the current answer to the grid component is the server emits a 'guess' event
  $socket.on('checkedAnswer', (data) => {
    gridStore.setCurrentAnswer(data.details)
    if (data.winner) {
      if (player.value === data.details.meta.player) {
        store.setGameEnd()
        store.setGameResult('win', data.details.meta.player)
        $confetti.addConfetti()
      } else {
        store.setGameEnd()
        store.setGameResult('lose', data.details.meta.player)
      }
    }
    if (!data.winner && gridStore.getGridFull) {
      store.setGameEnd()
      store.setGameResult('draw', null)
    }
  })

  // change the current turn if the server emits a 'changeTurn' event
  $socket.on('changeTurns', (e, fn) => {
    console.log('change turns', e)
    if (player.value === e.currentTurn) {
      mainStore.setMyTurn(true)
    } else {
      mainStore.setMyTurn(false)
    }
    fn()
  })

  // FOR PLAY AGAIN SOCKET EVENTS ----------------------

  // Check if the player has left the current room
  $socket.on('playerLeft', () => {
    if (!opponentLeft.value) {
      error.value = true
      error.message = 'Oops, your opponent left the game'
      opponentLeft.value = true
      store.setGameEnd()   // end the game
      store.setGameResult('win', player.value)
      $confetti.addConfetti()
      setTimeout(() => {
        error.value = false
      }, 2000)
    }
  })
}

// join the lobby for matchmaking
const findAGame = () => {
  if (error.value) return
  opponentLeft.value = false
  searching.value = true;
  action.value = true;
  overlay.value.classList.remove('h-0')
  overlay.value.classList.add('h-full')
}


const cancelSearch = () => {
  searching.value = false;
  action.value = false;
  overlay.value.classList.remove('h-full')
  overlay.value.classList.add('h-0')
}

const userLeft = () => {
  console.log('AJJJJJJAJJAAJJAJAJAJA')
  error.value = true
  if(searching.value) {
    error.message = 'Oops, your opponent left the room. Try again'
    searching.value = false;
    action.value = false;
    overlay.value.classList.remove('h-full')
    overlay.value.classList.add('h-0')
  } else {
    error.message = 'The other player left the room'
  }
  setTimeout(() => {
    error.value = false
  }, 3000)
}
// SOCKET EVENTS ENDS ------------------------------------------
// REGISTER THE SOCKET EVENT
if ($socket && $socket.connected) {
  console.log('connected')
  socketEvents()
} else {
  console.log('not connected')
}

</script>
  
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all;
  transition-duration: 200ms;
  transition-delay: 350ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.earlyFade-enter-active,
.earlyFade-leave-active {
  transition: all;
  transition-duration: 300ms;
  transition-delay: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.earlyFade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.earlyFade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>