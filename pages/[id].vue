<template>
  <div v-if="gameNotStarted"> Game Starts In {{ gameStartsIn }} </div>
  <div class="min-h-screen" v-else>
    <canvas class="h-screen w-screen max-h-screen max-w-full absolute bottom-0 left-0 pointer-events-none"
      ref="canvas"></canvas>
    <div class="bg-none border-b-[1px] border-solid border-lightBlack w-full text-center py-4 md:py-6">
      <logo-name class="font-black text-4xl"></logo-name>
    </div>
    <div
      class="container md:py-5 sm:w-3/4 md:w-4/5 lg:w-4/6 my-0 mx-auto h-full flex flex-col justify-start items-center">
      <div class="w-full px-6 flex flex-col md:flex-row justify-center items-center gap-7 md:gap-12">
        <div class="w-full flex flex-col justify-center items-center gap-8 md:gap-12">
          <grid :gridAnswers="gridAnswers" :columnClubs="columnClubs" :rowClubs="rowClubs" :currentAnswer="currentAnswer"
            :gameEnd="gameEnd" :playAgain="playAgain" @player-guess="sendGuessToStore" @game-ended="gameEnded"></grid>
          <transition name="fade" mode="out-in" appear>
            <div class="relative w-full md:w-full flex justify-center items-center" v-if="!gameEnd">
              <SearchBar @submit-answer="sendGuessToEmit" v-if="playerTurn" />
            </div>
            <div class="w-full flex flex-col justify-center items-center gap-5" v-else>
              <action-buttons></action-buttons>
            </div>
          </transition>
        </div>
        <div class="w-full h-full flex flex-col justify-between items-center gap-7 md:gap-10 lg:gap-14">
          <Transition name="fade">
            <div class="flex flex-col justify-center items-center gap-5 md:gap-8 lg:gap-12 w-full" v-if="!gameEnd">
              <Transition name="earlyFade" mode="out-in">
                <div class="w-full flex justify-center items-center gap-10" v-if="playerTurn">
                  <p class="text-base sm:text-2xl md:text-3xl font-bold">
                    YOUR TURN
                  </p>
                  <div class="w-5 h-5" :class="`bg-${getPlayerColor}`"></div>
                </div>

                <div class="w-full flex justify-center items-center gap-10" v-else>
                  <p class="text-base sm:text-2xl md:text-3xl font-bold">
                    OPPONENT'S TURN
                  </p>
                  <div class="w-5 h-5" :class="`bg-${getOpponentColor}`"></div>
                </div>
              </Transition>
              <div class="relative h-20 w-20 flex justify-center items-center">
                <Timer />
              </div>
            </div>
            <div class="result" v-else>
              <h1 class="font-black text-center text-4xl lg:text-6xl" v-if="gameResult != 'draw'">
                <span :class="winner === player ? `text-${getPlayerColor}` : 'text-lightBlack'"> YOU </span><span
                  :class="winner === player ? `text-${getPlayerColor}` : 'text-lightBlack'">{{ winner === player ? 'WIN' : 'LOSE'
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

const store = useGameStore()
const player = ref(null)

const { $confetti } = useNuxtApp()
const { $socket } = useNuxtApp()

const gameNotStarted = ref(true)
const gameStartsIn = ref(3)


onBeforeMount(() => {
  if (localStorage.getItem('id')) {
    player.value = localStorage.getItem('id')
  } else {
    player.value = uuidv4()
    localStorage.setItem('id', player.value)
  }
})
  setInterval(() => {
    if(gameStartsIn.value > 0){
      gameStartsIn.value--
    } else {
      clearInterval()
    }
  }, 1000)

watch(gameStartsIn, (current, previous)=>{
  if(current === 0){
    $socket.emit('gameStart', { id: player.value, gameId: store.gameId })
    console.log('game started')
    gameNotStarted.value = false
  }
})

$socket.on('startGame', (e) => {
  console.log('startGame', e)
  if (e.player1 === $socket.id) {
    store.setInitialPlayerTurn(true)
    store.setPlayerColor(e.color1)
  } else {
    store.setInitialPlayerTurn(false)
    store.setPlayerColor(e.color2)
  }
})

const { getPlayerColor } = storeToRefs(store)
const { getOpponentColor } = storeToRefs(store)
const { playerTurn } = storeToRefs(store)
const { gameResult } = storeToRefs(store)
const { gameEnd } = storeToRefs(store)
const { winner } = storeToRefs(store)

const canvas = ref(null)
const currentAnswer = ref({});
const playAgain = ref(0);

const sendGuessToEmit = (e) => {
  $socket.emit('guess', { guess: e, id: player.value, gameId: store.gameId })
  currentAnswer.value = {
    ...e,
    'playerId': player.value
  }
}

$socket.on('guess', (data) => {
  currentAnswer.value = {
    ...data.guess,
    'playerId': data.player
  }
})


const sendGuessToStore = (e) => {
  if (e.playerId === player.value) {
    store.addPlayerGuess(e)
  } else {
    store.addOpponentGuess(e)
  }
  store.changePlayerTurn()
  $socket.emit('changeTurn', { id: player.value, gameId: store.gameId })
}

$socket.on('changeTurn', (e) => {
  store.changePlayerTurn(e)
})

$socket.on('gameDecided', (e) => {
  console.log('winner is ' + e.winner)
  console.log('current player is' + player.value)
  if (e.winner) {
    store.setResult(e.winner === player.value ? 'win' : 'lose')
    store.setWinner(e.winner)
    store.setGameEnd()
    if (e.winner === player.value) {
      $confetti.addConfetti()
    }
  } else {
    store.setResult('draw')
    store.setWinner(null)
    store.setGameEnd()
  }
})

const gameEnded = (e) => {
  console.log(e)
  if (e.isDraw === true) {
    $socket.emit('gameDecided', { winner: null, gameId: store.gameId })
  } else {
    $socket.emit('gameDecided', { winner: e.winner, gameId: store.gameId })
  }
}

// const resetStore = () => {
//   store.reset()
//   playAgain.value++
// }

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