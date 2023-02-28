<template>
  <div v-if="searching">
    <div class="fixed top-0 left-0 w-full h-full bg-lightBlack bg-opacity-90 z-50 flex justify-center items-center">
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
  </div>
  <div v-if="gameNotStarted"> Game Starts In {{ gameStartsIn }} </div>
  <div class="min-h-screen bg-lightWhite" v-else>
    <Transition name="earlyFade">
      <div class=" w-1/2 absolute z-10 top-5 left-1/2 -translate-y-0 -translate-x-1/2">
        <base-card v-if="opponentLeft" class=""
          background-back="lightWhite" :background-front="getOpponentColor" cursor="cursor-default" :group-hover=false
          group-name="card" :grounded=false>
          Opponent Left The Game </base-card>
      </div>
    </Transition>
    <canvas class="h-screen w-screen max-h-screen max-w-full absolute bottom-0 left-0 pointer-events-none"
      ref="canvas"></canvas>
    <div class="border-b-[1px] border-solid border-lightBlack w-full text-center py-4 md:py-6"
      :class="`bg-${getPlayerColor}`">
      <logo-name class="font-black text-4xl" :foe-color="getOpponentColor" @click-logo="clickLogo()"></logo-name>
    </div>
    <div
      class="container md:py-5 sm:w-3/4 md:w-4/5 lg:w-4/6 my-0 mx-auto h-full flex flex-col justify-start items-center">
      <div class="w-full px-6 flex flex-col md:flex-row justify-center items-center gap-7 md:gap-12">
        <div class="w-full flex flex-col justify-center items-center gap-8 md:gap-12">
          <Grid :gridAnswers="gridAnswers" :columnClubs="columnClubs" :rowClubs="rowClubs" :currentAnswer="currentAnswer"
            :gameEnd="gameEnd" :resetGrid="resetGrid" @player-guess="sendGuessToStore" @game-ended="gameEnded"></Grid>
          <transition name="fade" mode="out-in" appear>
            <div class="relative w-full md:w-full flex justify-center items-center" v-if="!gameEnd">
              <SearchBar @submit-answer="sendGuessToEmit" v-if="playerTurn" />
            </div>
            <div class="w-full flex flex-col justify-center items-center gap-5" v-else>
              <action-buttons @new-game="startNewGame()"></action-buttons>
            </div>
          </transition>
        </div>
        <div class="w-full h-full flex flex-col justify-between items-center gap-7 md:gap-10 lg:gap-14">
          <Transition name="fade">
            <div class="flex flex-col justify-center items-center gap-5 md:gap-8 lg:gap-12 w-full" v-if="!gameEnd">
              <Transition name="earlyFade" mode="out-in">
                <div class="w-full flex justify-center items-center gap-10" v-if="playerTurn">
                  <base-card background-back="lightWhite" :background-front="getPlayerColor" cursor="cursor-default"
                    :group-hover=false group-name="card" :grounded=false> YOUR PLAY </base-card>
                </div>

                <div class="w-full flex justify-center items-center gap-10" v-else>
                  <base-card background-back="lightWhite" :background-front="getOpponentColor" cursor="cursor-default"
                    :group-hover=false group-name="card" :grounded=false> OPPONENT PLAY </base-card>
                </div>
              </Transition>
              <div class="relative h-20 w-20 flex justify-center items-center">
                <Timer />
              </div>
            </div>
            <div class="result" v-else>
              <h1 class="font-black text-center text-4xl lg:text-6xl" v-if="gameResult != 'draw'">
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
</template>
  
<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/'
import { v4 as uuidv4 } from 'uuid'
import { useRouter, useRoute } from 'vue-router';



// TEMPORARY ---------------------------------------------------------------------------------------------------------------
// register refs for the waiting
const gameNotStarted = ref(true)
const gameStartsIn = ref(3)

const interval = setInterval(() => {
  if (gameStartsIn.value > 0) {
    gameStartsIn.value--
  } else {
    gameNotStarted.value = false
    store.startTimer()
    clearInterval(interval)
  }
}, 1000)
// TEMPORARY END ------------------------------------------------------------------------------------------------------------



// register game store and router
const store = useGameStore()
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
    console.log(route.params.gameId)
    if (useGameStore().gameId == null || useGameStore().gameId == undefined || route.params.gameId != useGameStore().gameId) {
      return false
    } else {
      return true
    }
  }
})


// REGISTERING REFS

// know if the opponnet left the game
const opponentLeft = ref(false)

// get the state from store
const { getPlayerColor } = storeToRefs(store)
const { getOpponentColor } = storeToRefs(store)
const { playerTurn } = storeToRefs(store)
const { gameResult } = storeToRefs(store)
const { gameEnd } = storeToRefs(store)
const { winner } = storeToRefs(store)

// instantiate a null player
const player = ref(null)

// instantiate an empty guess. Will be filled later, when the searchBar component emits the guess.
const currentAnswer = ref({});

// the current timer
const { getTimer } = storeToRefs(store)

// ref for the confetti canvas
const canvas = ref(null)

// refs for the new game event
const matchmakingText = ref('Finding a game...')
const searching = ref(null)
const gameFound = ref(false)
const joiningGameIn = ref(3)
const resetGrid = ref(false)
const timeout = ref(0)


// REGISTERING REFS ENDS ---------


// wait unitl the game data is loaded from the db 
//............................................
//............................................
//............................................
//............................................


// Lifecycle Hooks ----------------------------------------------
// set the player id before the component is mounted
onBeforeMount(() => {
  if (localStorage.getItem('id')) {
    player.value = localStorage.getItem('id')
  } else {
    player.value = uuidv4()
    localStorage.setItem('id', player.value)
  }
  // store.resetGame()
  $socket.emit('gameStart', { id: player.value, gameId: store.gameId })
})

onBeforeRouteLeave((to, from, next) => {
  const answer = confirm('Are you sure you want to leave?')
  if (answer) {
    if (!store.gameEnd && !opponentLeft.value && store.gameId != null) {
      $socket.emit('userLeft', { id: player.value, gameId: store.gameId })
    }
    next()
  } else {
    next(false)
  }
})
// LIFECYCLE HOOKS ENDS -----------------------------------------

// WATCHERS START ------------------------------------------------

// watcher to check if the current turn is over 
watch(getTimer, (current, previous) => {
  if (current === 0 && playerTurn.value) {
    console.log('turn over')
    store.resetTimer()
    sendGuessToEmit({
      isEmpty: true,
    })
  }
})


// WATCHERS END --------------------------------------------------


// COMPUTED STARTS -----------------------------------------------

// computed to check if the player is the winner
const isWinner = computed(() => {
  return winner.value === player.value
})

// computed to return the player color class name
const returnClass = computed(() => {
  if (isWinner) {
    return `text-${getPlayerColor.value}`
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

// send the guess to server and grid. After the 'submit-answer' event is emitted by the searchBar component
const sendGuessToEmit = (e) => {

  // setting the current answer to the current guess, so that the grid component gets the new answer
  currentAnswer.value = {
    ...e,
    'playerId': player.value
  }

  // emitting a guess event to server and sending the current guess, along with the player id
  $socket.emit('guess', {
    guess: {
      ...e,
    }, id: player.value, gameId: store.gameId
  })
}

// sending the current guess to store after the grid completes checking the answer and emits a 'player-guess' events
const sendGuessToStore = (e) => {
  if (e.playerId === player.value) {
    // add to player guess
    console.log('adding to player guess')
    store.addPlayerGuess(e)
  } else {
    // add to opponent guess
    console.log('adding to opponent guess')
    store.addOpponentGuess(e)
  }

  // change the player turn in the localstate 
  store.resetTimer()
  store.changePlayerTurn()
  store.startTimer()
  $socket.emit('changeTurn', { id: player.value, gameId: store.gameId })
}

// emit event 'gameDecided' to the server after 'grid' component emits the 'game-ended' event
const gameEnded = (e) => {
  store.resetTimer()
  if (e.isDraw === true) {
    $socket.emit('gameDecided', { winner: null, gameId: store.gameId })
  } else {
    $socket.emit('gameDecided', { winner: e.winner, gameId: store.gameId })
  }
}

// PLAY AGAIN METHODS --------------------
// Search for a new game
const startNewGame = () => {
  searching.value = true  // make the player know that they are searching for a game
  gameFound.value = false  // make the player know that they have not found a game yet
  $socket.emit('leaveRoom', { id: player.value, gameId: store.gameId })  // leave the current room
}

// Cancel the search of a new game
const cancelSearch = () => {
  searching.value = false;
  gameFound.value = false;
  clearTimeout(timeout.value)
  $socket.emit('leaveLobby', { id: store.getCurrentPlayer })  // leave the lobby
}
// PLAY AGAIN METHODS ENDS -----------------
// METHODS ENDS -----------------------------------


// SOCKET EVENTS STARTS ----------------------------
const socketEvents = () => {

  // INITIAL GAME SOCKET EVENTS STARTS

  // decide who goes first, and also set who gets which color
  $socket.on('startGame', (e) => {
    if (e.player1 === $socket.id) {
      store.setInitialPlayerTurn(true)
      store.setPlayerColor(e.color1)
    } else {
      store.setInitialPlayerTurn(false)
      store.setPlayerColor(e.color2)
    }
  })

  // send the current answer to the grid component is the server emits a 'guess' event
  $socket.on('guess', (data) => {
    // store.resetTimer()
    currentAnswer.value = {
      ...data.guess,
      'playerId': data.player,
    }
  })

  // change the current turn if the server emits a 'changeTurn' event
  $socket.on('changeTurn', (e) => {
    store.changePlayerTurn(e)
    store.resetTimer()
    store.startTimer()
  })

  // check if the 'gameDecided is emitted by the server'
  $socket.on('gameDecided', (e) => {
    store.resetTimer()
    // check if the game has a winner
    if (e.winner) {
      // If Yes...
      store.setResult(e.winner === player.value ? 'win' : 'lose')  // set the result of the current player
      store.setWinner(e.winner)    // set the winner of the game
      store.setGameEnd()   // end the game
      // check if the current player is the winner
      if (e.winner === player.value) {
        // If Yes add the confetti
        $confetti.addConfetti()
      }
    } else {
      // If No....
      store.setResult('draw')  // set the game result to 'draw'
      store.setWinner(null)  // set the winner to null
      store.setGameEnd()    // end the game
    }
  })

  // INITIAL GAME SOCKET EVENTS ENDS ---------------------------

  // FOR PLAY AGAIN SOCKET EVENTS ----------------------

  // Check if the player has left the current room
  $socket.on('roomLeft', (e) => {
    gameFound.value = false
    const delayTime = setTimeout(() => {
      $socket.emit('joinLobby', { id: store.getCurrentPlayer })    // join the lobby after exiting the room
    }, 1000)
    timeout.value = delayTime
  })

  // Check if the player joined the lobby
  $socket.on('lobbyJoined', (data) => {
    console.log('joined lobby' + data)
  })

  // Check if the player left the lobby
  $socket.on('lobbyLeft', () => {
    console.log('left lobby')
  })

  // check to see if the client has found a game. If yes, emit an event to join the game
  $socket.on('gameFound', (data) => {
    if (data.players.includes(store.getCurrentSocketId)) {
      matchmakingText.value = 'Game Found'
      gameFound.value = true
      $socket.emit('joinGame', { id: store.getCurrentPlayer, gameId: data.gameId })
    }
  })

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
          $router.push(`/game/${store.gameId}`)
        }
      }, 1000)

    }
  })

  $socket.on('userLeft', () => {
    if (!store.gameEnd) {
      console.log('user left')
      opponentLeft.value = true
      // setTimeout(() => {
      //   opponentLeft.value = false
      // }, 3000)
      store.setGameEnd()   // end the game
      store.setResult('win')  // set the result of the current player
      store.setWinner(player.value)    // set the winner of the game
      $confetti.addConfetti()
      store.resetTimer()
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


// DATA FOR TEST USE
const columnClubs = [
  {
    _id: "63e5279042fd03399bdfe733",
    id: 4,
    name: "Newcastle",
    fullName: "Newcastle United",
    league: "Premier League",
    country: "England",
    squad: [],
    __v: 0,
  },
  {
    _id: "63e5279042fd03399bdfe73f",
    id: 16,
    name: "Leeds",
    fullName: "Leeds United",
    league: "Premier League",
    country: "England",
    squad: [],
    __v: 0,
  },
  {
    _id: "63e5279042fd03399bdfe737",
    id: 8,
    name: "Fulham",
    fullName: "Fulham FC",
    league: "Premier League",
    country: "England",
    squad: [],
    __v: 0,
  },
];

const matches = [
  [
    [
      {
        _id: "63e6728539bcf168cdb0456a",
        id: 456,
        name: "Ivan Toney",
        shirtNumber: 17,
        position: "Centre-Forward",
        currentClub: "63e5279042fd03399bdfe736",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe736",
          "63e5279042fd03399bdfe733",
        ],
        __v: 0,
      },
    ],
    [
      {
        _id: "63e67061a57e5e3208658468",
        id: 295,
        name: "Alex McCarthy",
        shirtNumber: 1,
        position: "Goalkeeper",
        currentClub: "63e5279042fd03399bdfe743",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe743",
          "63e5279042fd03399bdfe73b",
          "63e5279042fd03399bdfe73f",
          "63e5279042fd03399bdfe736",
        ],
        __v: 0,
      },
      {
        _id: "63e6728539bcf168cdb04557",
        id: 437,
        name: "Pontus Jansson",
        shirtNumber: 18,
        position: "Centre-Back",
        currentClub: "63e5279042fd03399bdfe736",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe736",
          "63e5279042fd03399bdfe73f",
          "63e52868b969baef8ede499d",
        ],
        __v: 0,
      },
      {
        _id: "63e672ed6633ea3de73e5e88",
        id: 467,
        name: "Stuart Dallas",
        shirtNumber: 15,
        position: "Right-Back",
        currentClub: "63e5279042fd03399bdfe73f",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe73f",
          "63e5279042fd03399bdfe736",
        ],
        __v: 0,
      },
      {
        _id: "63e672ed6633ea3de73e5e8c",
        id: 471,
        name: "Adam Forshaw",
        shirtNumber: 4,
        position: "Central Midfield",
        currentClub: "63e5279042fd03399bdfe73f",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe73f",
          "63e5279042fd03399bdfe736",
        ],
        __v: 0,
      },
    ],
    [
      {
        _id: "63e673f311bdd788d422cdcf",
        id: 517,
        name: "Ryan Fredericks",
        shirtNumber: 2,
        position: "Right-Back",
        currentClub: "63e5279042fd03399bdfe742",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe742",
          "63e5279042fd03399bdfe740",
          "63e5279042fd03399bdfe737",
          "63e5279042fd03399bdfe734",
          "63e5279042fd03399bdfe736",
        ],
        __v: 0,
      },
    ],
  ],
  [
    [
      {
        _id: "63e66d36a1934494aacabf86",
        id: 172,
        name: "Jamaal Lascelles",
        shirtNumber: 6,
        position: "Centre-Back",
        currentClub: "63e5279042fd03399bdfe733",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe733",
          "63e5279042fd03399bdfe73c",
        ],
        __v: 0,
      },
      {
        _id: "63e6716957c170b9969f4fc0",
        id: 366,
        name: "Jack Colback",
        shirtNumber: 8,
        position: "Defensive Midfield",
        currentClub: "63e5279042fd03399bdfe73c",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe73c",
          "63e5279042fd03399bdfe733",
        ],
        __v: 0,
      },
      {
        _id: "63e6716957c170b9969f4fc5",
        id: 371,
        name: "Jonjo Shelvey",
        shirtNumber: 6,
        position: "Central Midfield",
        currentClub: "63e5279042fd03399bdfe73c",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe73c",
          "63e5279042fd03399bdfe733",
          "63e5279042fd03399bdfe739",
        ],
        __v: 0,
      },
      {
        _id: "63e6716957c170b9969f4fd0",
        id: 382,
        name: "Chris Wood",
        shirtNumber: 39,
        position: "Centre-Forward",
        currentClub: "63e5279042fd03399bdfe733",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe733",
          "63e5279042fd03399bdfe73c",
          "63e5279042fd03399bdfe73f",
          "63e5279042fd03399bdfe73d",
          "63e5279042fd03399bdfe735",
        ],
        __v: 0,
      },
    ],
    [
      {
        _id: "63e6716957c170b9969f4fd0",
        id: 382,
        name: "Chris Wood",
        shirtNumber: 39,
        position: "Centre-Forward",
        currentClub: "63e5279042fd03399bdfe733",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe733",
          "63e5279042fd03399bdfe73c",
          "63e5279042fd03399bdfe73f",
          "63e5279042fd03399bdfe73d",
          "63e5279042fd03399bdfe735",
        ],
        __v: 0,
      },
      {
        _id: "63e672ed6633ea3de73e5e95",
        id: 480,
        name: "Patrick Bamford",
        shirtNumber: 9,
        position: "Centre-Forward",
        currentClub: "63e5279042fd03399bdfe73f",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe73f",
          "63e5279042fd03399bdfe738",
          "63e5279042fd03399bdfe73b",
          "63e5279042fd03399bdfe73c",
        ],
        __v: 0,
      },
    ],
    [
      {
        _id: "63e6716957c170b9969f4fbb",
        id: 361,
        name: "Neco Williams",
        shirtNumber: 7,
        position: "Right-Back",
        currentClub: "63e5279042fd03399bdfe73c",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe73c",
          "63e5279042fd03399bdfe739",
          "63e5279042fd03399bdfe737",
        ],
        __v: 0,
      },
    ],
  ],
  [
    [
      {
        _id: "63e66d36a1934494aacabf95",
        id: 187,
        name: "Anthony Gordon",
        shirtNumber: 8,
        position: "Left Winger",
        currentClub: "63e5279042fd03399bdfe733",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe733",
          "63e5279042fd03399bdfe741",
        ],
        __v: 0,
      },
      {
        _id: "63e670d9160b3d5932b7a1c1",
        id: 345,
        name: "Andros Townsend",
        shirtNumber: 14,
        position: "Right Winger",
        currentClub: "63e5279042fd03399bdfe741",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe741",
          "63e5279042fd03399bdfe73b",
          "63e5279042fd03399bdfe733",
          "63e5279042fd03399bdfe734",
          "63e5279042fd03399bdfe73f",
        ],
        __v: 0,
      },
    ],
    [
      {
        _id: "63e670d9160b3d5932b7a1ae",
        id: 326,
        name: "Andy Lonergan",
        shirtNumber: 31,
        position: "Goalkeeper",
        currentClub: "63e5279042fd03399bdfe741",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe741",
          "63e5279042fd03399bdfe739",
          "63e5279042fd03399bdfe73f",
          "63e5279042fd03399bdfe73e",
          "63e5279042fd03399bdfe737",
        ],
        __v: 0,
      },
      {
        _id: "63e670d9160b3d5932b7a1c1",
        id: 345,
        name: "Andros Townsend",
        shirtNumber: 14,
        position: "Right Winger",
        currentClub: "63e5279042fd03399bdfe741",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe741",
          "63e5279042fd03399bdfe73b",
          "63e5279042fd03399bdfe733",
          "63e5279042fd03399bdfe734",
          "63e5279042fd03399bdfe73f",
        ],
        __v: 0,
      },
      {
        _id: "63e672ed6633ea3de73e5e80",
        id: 459,
        name: "Joel Robles",
        shirtNumber: 22,
        position: "Goalkeeper",
        currentClub: "63e5279042fd03399bdfe73f",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe73f",
          "63e5281d15e7e9fb79c84945",
          "63e5279042fd03399bdfe741",
          "63e5281d15e7e9fb79c84942",
          "63e5281d15e7e9fb79c84943",
        ],
        __v: 0,
      },
    ],
    [
      {
        _id: "63e670d9160b3d5932b7a1ae",
        id: 326,
        name: "Andy Lonergan",
        shirtNumber: 31,
        position: "Goalkeeper",
        currentClub: "63e5279042fd03399bdfe741",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe741",
          "63e5279042fd03399bdfe739",
          "63e5279042fd03399bdfe73f",
          "63e5279042fd03399bdfe73e",
          "63e5279042fd03399bdfe737",
        ],
        __v: 0,
      },
      {
        _id: "63e67374c6167f52d4f9eec2",
        id: 485,
        name: "Shane Duffy",
        shirtNumber: 5,
        position: "Centre-Back",
        currentClub: "63e5279042fd03399bdfe737",
        clubsPlayedFor: [
          "63e5279042fd03399bdfe737",
          "63e5279042fd03399bdfe735",
          "63e5279042fd03399bdfe741",
        ],
        __v: 0,
      },
    ],
  ],
];

const rowClubs = [
  {
    _id: "63e5279042fd03399bdfe736",
    id: 7,
    name: "Brentford",
    fullName: "Brentford FC",
    league: "Premier League",
    country: "England",
    squad: [],
    __v: 0,
  },
  {
    _id: "63e5279042fd03399bdfe73c",
    id: 13,
    name: "Nottm Forest",
    fullName: "Nottingham Forest",
    league: "Premier League",
    country: "England",
    squad: [],
    __v: 0,
  },
  {
    _id: "63e5279042fd03399bdfe741",
    id: 18,
    name: "Everton",
    fullName: "Everton FC",
    league: "Premier League",
    country: "England",
    squad: [],
    __v: 0,
  },
];

const gridAnswers = [
  matches[0][0],
  matches[0][1],
  matches[0][2],
  matches[1][0],
  matches[1][1],
  matches[1][2],
  matches[2][0],
  matches[2][1],
  matches[2][2],
];
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