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
  <Transition name="fade"
    class="fixed top-0 left-0 w-full h-full bg-lightBlack bg-opacity-90 z-50 flex justify-center items-center">
    <div v-if="searching">
      <base-card class="py-7 px-20" background-back="lightWhite" background-front="blue" cursor="cursor-default"
        :groupHover="false" groupName="card" :grounded=false>
        <div class="flex flex-col justify-center items-center gap-14">
          <div class="text-3xl font-bold text-center"> {{ matchmakingText }} </div>
          <div class="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green"></div>
          <base-card class="px-8 text-xl" background-back="lightWhite" background-front="green" :groupHover="true"
            groupName="group" :grounded=false @click="cancelSearch()" v-if="!gameFound"> CANCEL
          </base-card>
        </div>
      </base-card>
    </div>
  </Transition>
  <Transition name="fade">
    <div v-if="gameNotStarted" class="fixed top-0 left-0 w-full h-screen bg-green z-50 flex justify-center items-center">
      <base-card class="py-7 px-20" background-back="lightWhite" background-front="blue" cursor="cursor-default"
        :groupHover="false" groupName="card" :grounded=false>
        <div class="flex flex-col justify-center items-center gap-14">
          <div class="text-3xl font-bold text-center"> Game Starts In {{ gameStartsIn }} </div>
        </div>
      </base-card>
    </div>
    <div class="min-h-screen bg-lightWhite" v-else>
      <Transition name="earlyFade">
        <div class=" w-1/2 absolute z-10 top-5 left-1/2 -translate-y-0 -translate-x-1/2">
          <base-card v-if="opponentLeft" class="" background-back="lightWhite" :background-front="mainStore.getOpponentColor"
            cursor="cursor-default" :group-hover=false group-name="card" :grounded=false>
            Opponent Left The Game </base-card>
        </div>
      </Transition>
      <canvas class="h-screen w-screen max-h-screen max-w-full absolute bottom-0 left-0 pointer-events-none"
        ref="canvas"></canvas>
      <div class="border-b-[1px] border-solid border-lightBlack w-full text-center py-4 md:py-6"
        :class="`bg-${mainStore.getMyColor}`">
        <logo-name class="font-black text-4xl" :foe-color="mainStore.getOpponentColor" @click-logo="clickLogo()"></logo-name>
      </div>
      <div
        class="container md:py-5 sm:w-3/4 md:w-4/5 lg:w-4/6 my-0 mx-auto h-full flex flex-col justify-start items-center">
        <div class="w-full px-6 flex flex-col md:flex-row justify-center items-center gap-7 md:gap-12">
          <div class="w-full flex flex-col justify-center items-center gap-8 md:gap-12">
            <!-- <Grid :currentAnswer="currentAnswer" :gameEnd="gameEnd" :resetGrid="resetGrid"
              @player-guess="sendGuessToStore" @game-ended="gameEnded"></Grid> -->
            <tryGrid ref="grid"></tryGrid>
            <transition name="fade" mode="out-in" appear>
              <div class="relative w-full md:w-full flex justify-center items-center" v-if="!getGameEnd">
                
                  <SearchBar @submit-answer="sendGuessToEmit" v-if="getMyTurn" />
                
              </div>
              <div class="w-full flex flex-col justify-center items-center gap-5" v-else>
                <action-buttons @new-game="startNewGame()"></action-buttons>
              </div>
            </transition>
          </div>
          <div class="w-full h-full flex flex-col justify-between items-center gap-7 md:gap-10 lg:gap-14">
            <Transition name="fade">
              <div class="flex flex-col justify-center items-center gap-5 md:gap-8 lg:gap-12 w-full" v-if="!getGameEnd">
                <Transition name="earlyFade" mode="out-in">
                  <div class="w-full flex justify-center items-center gap-10" v-if="getMyTurn">
                    <base-card background-back="lightWhite" :background-front="mainStore.getMyColor" cursor="cursor-default"
                      :group-hover=false group-name="card" :grounded=false> YOUR PLAY </base-card>
                  </div>

                  <div class="w-full flex justify-center items-center gap-10" v-else>
                    <base-card background-back="lightWhite" :background-front="mainStore.getOpponentColor" cursor="cursor-default"
                      :group-hover=false group-name="card" :grounded=false> OPPONENT PLAY </base-card>
                  </div>
                </Transition>
                <div class="relative h-20 w-20 flex justify-center items-center">
                  <Timer />
                </div>
              </div>
              <div class="result" v-else>
                <h1 class="font-black text-center text-4xl lg:text-6xl" v-if="getGameResult != 'draw'">
                  <span :class="returnClass"> YOU </span><span :class="returnClass">{{ isWinner ? 'WIN' :
                    'LOSE'
                  }}</span>
                </h1>
                <h1 class="font-black text-center text-4xl lg:text-6xl" v-else>
                  <span class="text-lightBlack"> Oops! YOU DREW </span>
                </h1>
              </div>
            </Transition>
            <div class="w-full sm:w-3/4 flex justify-between items-center">
              <PlayerGuesses />
            </div>
          </div>
        </div>
      </div>
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


// register refs for the waiting
const gameNotStarted = ref(true)
const gameStartsIn = ref(3)

// register game store and router
const store = useGameStore()
const mainStore = useMainStore()
const gridStore = useGridStore()
const $router = useRouter()

mainStore.$subscribe(() => {
  console.log('mainStore changed')
})


const { getMyTurn } = storeToRefs(mainStore)

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

// get the state from store
const { getGameEnd, getWinner, getGameResult } = storeToRefs(store)

// instantiate a null player
const player = ref(null)

// ref for the confetti canvas
const canvas = ref(null)

// refs for the new game event
const matchmakingText = ref('Finding a game...')
const searching = ref(null)
const gameFound = ref(false)
const joiningGameIn = ref(3)
const timeout = ref(0)


// REGISTERING REFS ENDS ---------


// Lifecycle Hooks ----------------------------------------------
// set the player id before the component is mounted
onBeforeMount(async () => {
  const interval = setInterval(() => {
    if (gameStartsIn.value > 0) {
      gameStartsIn.value--
    } else {
      gameNotStarted.value = false
      $socket.emit('start', { id: player.value, gameId: store.getGameId, playerTurn: getMyTurn.value })
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
  $socket.emit('ready', { id: player.value, gameId: store.getGameId })
})


onBeforeRouteLeave((to, from, next) => {
  if (!store.getGameEnd && !opponentLeft.value && store.getGameId != null) {
    playerWantingToLeave.value = true
    if (playerDecidedToLeave.value != null) {
      if (playerDecidedToLeave.value === true) {
        if (!store.getGameEnd && !opponentLeft.value && store.getGameId != null) {
          // $socket.emit('userLeft', { id: player.value, gameId: store.getGameId })
          next()
        }
      } else {
        next(false)
      }
    } else {
      next(false)
    }
  } else {
    next()
  }
})


// LIFECYCLE HOOKS ENDS -----------------------------------------

// WATCHERS START ------------------------------------------------

watch(playerDecidedToLeave, (current, previous) => {
  if (current === true) {
    if (!store.getGameEnd && !opponentLeft.value && store.getGameId != null) {
      $socket.emit('userLeft', { id: player.value, gameId: store.getGameId })
      $router.push('/')
    } else {
      $router.push('/')
    }
  } else {

  }
})

// WATCHERS END --------------------------------------------------


// COMPUTED STARTS -----------------------------------------------

// computed to check if the player is the winner
const isWinner = computed(() => {
  return getWinner.value === player.value
})

// computed to return the player color class name
const returnClass = computed(() => {
  if (isWinner) {
    return `text-${mainStore.getMyColor.value}`
  } else {
    return 'text-lightBlack'
  }
})

// COMPUTED ENDS -------------------------------------------------

// METHODS STARTS -------------------------------------------------

// method to go to home page
const clickLogo = () => {
  $router.push('/')
}

const leaveGame = () => {
  playerDecidedToLeave.value = true
  // playerWantingToLeave.value = false
}

const dontLeaveGame = () => {
  playerWantingToLeave.value = false
  playerDecidedToLeave.value = false
}

// send the guess to server and grid. After the 'submit-answer' event is emitted by the searchBar component
const sendGuessToEmit = async (e) => {
  if(!getMyTurn.value) return
  $socket.emit('checkAnswer', {
    answer: {
      ...e,
    }, id: player.value, gameId: store.getGameId
  })
}

gridStore.$subscribe((mut, state) => {
  if(store.getGameEnd) return
  setTimeout(() => {
    $socket.emit('changeTurns', { gameId: store.getGameId })
  }, 500)
})

// PLAY AGAIN METHODS --------------------
// // Search for a new game
// const startNewGame = () => {
//   searching.value = true  // make the player know that they are searching for a game
//   gameFound.value = false  // make the player know that they have not found a game yet
//   $socket.emit('leaveRoom', { id: player.value, gameId: store.getGameId })  // leave the current room
// }

// // Cancel the search of a new game
// const cancelSearch = () => {
//   searching.value = false;
//   gameFound.value = false;
//   clearTimeout(timeout.value)
//   $socket.emit('leaveLobby', { id: store.getCurrentPlayer })  // leave the lobby
// }
// // PLAY AGAIN METHODS ENDS -----------------
// METHODS ENDS -----------------------------------


// SOCKET EVENTS STARTS ----------------------------
const socketEvents = () => {

  // INITIAL GAME SOCKET EVENTS STARTS
  $socket.on('timer', (e) => {
    useTimerStore().setTimer(e.time)
  })

  // decide who goes first, and also set who gets which color
  $socket.on('startGame', (e) => {
    if (e.player1 === $socket.id) {
      mainStore.setMyTurn(true)
      mainStore.setMyColor(e.color1)
      mainStore.setOpponentColor(e.color2)
      console.log(getMyTurn.value)
    } else {
      mainStore.setMyTurn(false)
      mainStore.setMyColor(e.color2)
      mainStore.setOpponentColor(e.color1)
      console.log(getMyTurn.value)
    }
  })

  // send the current answer to the grid component is the server emits a 'guess' event
  $socket.on('checkedAnswer', (data) => {
    gridStore.setCurrentAnswer(data.details)
    if(data.winner){
      if(player.value === data.details.meta.player){
        store.setGameEnd()
        store.setGameResult('win', data.details.meta.player)
      } else {
        store.setGameEnd()
        store.setGameResult('lose', data.details.meta.player)
      }
    }
    if(data.draw){
      store.setGameEnd()
      store.setGameResult('draw', data.details.meta.player)
    }
  })

  // change the current turn if the server emits a 'changeTurn' event
  $socket.on('changeTurns', (e, fn) => {
    mainStore.changeTurns()
    fn()
  })

  // check if the 'gameDecided is emitted by the server'
  // $socket.on('gameDecided', (e) => {
  //   // check if the game has a winner
  //   if (e.winner) {
  //     // If Yes...
  //     store.setResult(e.winner === player.value ? 'win' : 'lose')  // set the result of the current player
  //     store.setWinner(e.winner)    // set the winner of the game
  //     store.setGameEnd()   // end the game
  //     // check if the current player is the winner
  //     if (e.winner === player.value) {
  //       // If Yes add the confetti
  //       $confetti.addConfetti()
  //     }
  //   } else {
  //     // If No....
  //     store.setResult('draw')  // set the game result to 'draw'
  //     store.setWinner(null)  // set the winner to null
  //     store.setGameEnd()    // end the game
  //   }
  // })

  // INITIAL GAME SOCKET EVENTS ENDS ---------------------------

  // FOR PLAY AGAIN SOCKET EVENTS ----------------------

  // Check if the player has left the current room
  $socket.on('roomLeft', (e) => {
    gameFound.value = false
    const delayTime = setTimeout(() => {
      $socket.emit('joinLobby', { id: mainStore.getMyId })    // join the lobby after exiting the room
    }, 1000)
    timeout.value = delayTime
  })

  // check to see if the client has found a game. If yes, emit an event to join the game
  // $socket.on('gameFound', (data) => {
  //   if (data.players.includes(store.getCurrentSocketId)) {
  //     matchmakingText.value = 'Game Found'
  //     gameFound.value = true
  //     $socket.emit('joinGame', { id: store.getCurrentPlayer, gameId: data.gameId })
  //   }
  // })

  // Check if the player has joined the game
  // check to see if the client has joined the game. If yes, set the game id into the store. 
  $socket.on('gameJoined', (data) => {
    matchmakingText.value = `Joining game...`
  })

  $socket.on('bothPlayersJoined', (data) => {
    if (data.isJoined) {
      const Newinterval = setInterval(() => {
        if (joiningGameIn.value > 0) {
          matchmakingText.value = `Joining game in ${joiningGameIn.value}...`
          joiningGameIn.value -= 1
        } else {
          store.resetGame()
          clearInterval(Newinterval)
          joiningGameIn.value = 3
          // set the game id to the store.
          store.setGameId(data.gameId)

          // set the gameData to store
          gridStore.setColumnClubs(data.gameData.columnClubs)
          gridStore.setRowClubs(data.gameData.rowClubs)
          gridStore.setMatches(data.gameData.matches)
          gridStore.setGridAnswers()

          $router.push(`/game/${store.getGameId}`)
        }
      }, 1000)

    }
  })

  $socket.on('userLeft', () => {
    if (!store.getGameEnd) {
      opponentLeft.value = true
      // store.setGameEnd()   // end the game
      // store.setResult('win')  // set the result of the current player
      store.setGameResult('win', player.value)
      // store.setWinner(player.value)    // set the winner of the game
      $confetti.addConfetti()
    }
  })


  // PLAY AGAIN SOCKET EVENTS END ---------------------------------
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