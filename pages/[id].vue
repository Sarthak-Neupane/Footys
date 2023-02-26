<template>
  <div v-if="searching">
    <div class="fixed top-0 left-0 w-full h-full bg-lightBlack bg-opacity-90 z-50 flex justify-center items-center">
      <div
        class="flex flex-col justify-center items-center bg-darkWhite gap-8 py-8 px-7 rounded-md border-2 border-solid border-x-green border-y-blue">
        <div class="text-3xl font-bold text-center"> {{ matchmakingText }} </div>
        <div class="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green" v-if="searching"></div>
        <base-button class="bg-none text-lightBlack font-medium border-solid border-blue border-2 rounded-lg w-60 py-2"
          @click="cancelSearch()">
          Cancel </base-button>
      </div>
    </div>
  </div>
  <div v-if="gameNotStarted"> Game Starts In {{ gameStartsIn }} </div>
  <div class="min-h-screen bg-lightWhite" v-else>
    <canvas class="h-screen w-screen max-h-screen max-w-full absolute bottom-0 left-0 pointer-events-none"
      ref="canvas"></canvas>
    <div class="border-b-[1px] border-solid border-lightBlack w-full text-center py-4 md:py-6"
      :class="`bg-${getPlayerColor}`">
      <logo-name class="font-black text-4xl" :foe-color="getOpponentColor"></logo-name>
    </div>
    <div
      class="container md:py-5 sm:w-3/4 md:w-4/5 lg:w-4/6 my-0 mx-auto h-full flex flex-col justify-start items-center">
      <div class="w-full px-6 flex flex-col md:flex-row justify-center items-center gap-7 md:gap-12">
        <div class="w-full flex flex-col justify-center items-center gap-8 md:gap-12">
          <new-grid :gridAnswers="gridAnswers" :columnClubs="columnClubs" :rowClubs="rowClubs" :currentAnswer="currentAnswer"
            :gameEnd="gameEnd" :resetGrid="resetGrid" @player-guess="sendGuessToStore" @game-ended="gameEnded"></new-grid>
          <!-- <grid :gridAnswers="gridAnswers" :columnClubs="columnClubs" :rowClubs="rowClubs" :currentAnswer="currentAnswer"
            :gameEnd="gameEnd" :resetGrid="resetGrid" @player-guess="sendGuessToStore" @game-ended="gameEnded"></grid> -->
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
                  <base-card background-back="bg-lightWhite" :background-front="getPlayerColor"
                    cursor="cursor-default" :group-hover=false group-name="card" :grounded=false> YOUR PLAY </base-card>
                </div>

                <div class="w-full flex justify-center items-center gap-10" v-else>
                  <base-card background-back="bg-lightWhite" :background-front="getOpponentColor"
                    cursor="cursor-default" :group-hover=false group-name="card" :grounded=false> OPPONENT PLAY </base-card>
                </div>
              </Transition>
              <div class="relative h-20 w-20 flex justify-center items-center">
                <Timer />
              </div>
            </div>
            <div class="result" v-else>
              <h1 class="font-black text-center text-4xl lg:text-6xl" v-if="gameResult != 'draw'">
                <span :class="winner === player ? `text-${getPlayerColor}` : 'text-lightBlack'"> YOU </span><span
                  :class="winner === player ? `text-${getPlayerColor}` : 'text-lightBlack'">{{ winner === player ? 'WIN' :
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
import { useRouter } from 'vue-router';



// TEMPORARY ---------------------------------------------------------------------------------------------------------------
// register refs for the waiting
const gameNotStarted = ref(true)
const gameStartsIn = ref(3)

setInterval(() => {
  if (gameStartsIn.value > 0) {
    gameStartsIn.value--
  } else {
    clearInterval()
  }
}, 1000)
// TEMPORARY END ------------------------------------------------------------------------------------------------------------



// register game store and router
const store = useGameStore()
const $router = useRouter()

// register plugins
const { $confetti } = useNuxtApp()
const { $socket } = useNuxtApp()



// REGISTERING REFS

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

// ref for the confetti canvas
const canvas = ref(null)

// refs for the new game event
const matchmakingText = ref('Finding a game...')
const searching = ref(null)
const joiningGameIn = ref(3)
const resetGrid = ref(false)


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
})
// LIFECYCLE HOOKS ENDS -----------------------------------------

// WATCHERS START ------------------------------------------------

// watcher to check if the countdown is finished and game can be started
watch(gameStartsIn, (current, previous) => {
  if (current === 0) {
    // emit socket event to start the game.
    $socket.emit('gameStart', { id: player.value, gameId: store.gameId })
    gameNotStarted.value = false
  }
})

// watcher to check the countdown for joining a new game
watch(joiningGameIn, (current, previous) => {
  if (current === 0) {
    resetGrid.value = true
    $router.push(`/${store.gameId}`)
  }
})

// WATCHERS END --------------------------------------------------

// METHODS STARTS -------------------------------------------------

// send the guess to server and grid. After the 'submit-answer' event is emitted by the searchBar component
const sendGuessToEmit = (e) => {
  // emitting a guess event to server and sending the current game, along with the player
  $socket.emit('guess', { guess: e, id: player.value, gameId: store.gameId })

  // setting the current answer to the current guess, so that the grid component gets the new answer
  currentAnswer.value = {
    ...e,
    'playerId': player.value
  }
}

// sending the current guess to store after the grid completes checking the answer and emits a 'player-guess' events
const sendGuessToStore = (e) => {
  // check if the guess is of player or the opponent
  if (e.playerId === player.value) {
    // add to player guess
    store.addPlayerGuess(e)
  } else {
    // add to opponent guess
    store.addOpponentGuess(e)
  }
  // change the player turn in the localstate 
  store.changePlayerTurn()  // --------------------------------------------------------THIS COULD BE REMOVED I GUESS--------
  $socket.emit('changeTurn', { id: player.value, gameId: store.gameId })
}

// emit event 'gameDecided' to the server after 'grid' component emits the 'game-ended' event
const gameEnded = (e) => {
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
  $socket.emit('leaveRoom', { id: player.value, gameId: store.gameId })  // leave the current room
}

// Cancel the search of a new game
const cancelSearch = () => {
  searching.value = false;
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

  // send the current answer the the grid component is the server emits a 'guess' event
  $socket.on('guess', (data) => {
    currentAnswer.value = {
      ...data.guess,
      'playerId': data.player
    }
  })

  // change the current turn if the server emits a 'changeTurn' event
  $socket.on('changeTurn', (e) => {
    store.changePlayerTurn(e)
  })

  // check if the 'gameDecided is emitted by the server'
  $socket.on('gameDecided', (e) => {
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
    store.resetGame()         // reset the store
    $socket.emit('joinLobby', { id: store.getCurrentPlayer })    // join the lobby after exiting the room
  })

  // Check if the player joined the lobby
  $socket.on('lobbyJoined', (data) => {
    console.log('joined lobby' + data)
  })

  // Check if the player left the lobby
  $socket.on('lobbyLeft', () => {
    console.log('left lobby')
  })

  // Check if the player found a new game
  $socket.on('gameFound', (data) => {
    matchmakingText.value = 'Game Found'  // set the matchmaking value

    // emit a 'joinGame' event to the server to join the game that was found
    $socket.emit('joinGame', { id: store.getCurrentPlayer, gameId: data.gameId })
  })

  // Check if the player has joined the game
  $socket.on('gameJoined', (data) => {
    store.setGameId(data.gameId)         // set the new game id in to store

    // hardcode a set interval to get the player ready to join the new game
    setInterval(() => {
      if (joiningGameIn.value > 0) {
        matchmakingText.value = `Joining game in ${joiningGameIn.value}...`
        console.log(`Joining game in ${joiningGameIn.value}...`)
        joiningGameIn.value--
      } else {
        clearInterval()
      }
    }, 1000)
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