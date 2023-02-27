<template>
    <div class="grid grid-cols-4 grid-rows-4 content-center items-center w-full" ref="grid">
        <div class="tile outerCell"></div>
        <div class="tile outerCell">{{ rowClubs[0].name }}</div>
        <div class="tile outerCell">{{ rowClubs[1].name }}</div>
        <div class="tile outerCell ">{{ rowClubs[2].name }}</div>
        <div class="tile outerCell"> {{ columnClubs[0].name }} </div>

        <div class="tile innerCell relative " data-grid="[1,1]" data-number="8" ref="OneByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite "> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>

        <div class="tile innerCell relative" data-grid="[1,2]" data-number="1" ref="OneByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>

        <div class="tile innerCell relative" data-grid="[1,3]" data-number="6" ref="OneByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile outerCell">{{ columnClubs[1].name }}</div>
        <div class="tile innerCell relative" data-grid="[2,1]" data-number="3" ref="TwoByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-grid="[2,2]" data-number="5" ref="TwoByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-grid="[2,3]" data-number="7" ref="TwoByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile outerCell">{{ columnClubs[2].name }}</div>
        <div class="tile innerCell relative" data-grid="[3,1]" data-number="4" ref="ThreeByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-grid="[3,2]" data-number="9" ref="ThreeByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-grid="[3,3]" data-number="2" ref="ThreeByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
    </div>
</template>


<script setup>
import { useGameStore } from '@/store/';
import gsap from 'gsap';

const store = useGameStore();

const props = defineProps({
    'gridAnswers': Array,
    'columnClubs': Array,
    'rowClubs': Array,
    'currentAnswer': Object,
    'resetGrid': Boolean
})

const emit = defineEmits(['playerGuess', 'gameEnded'])


const playerIndexes = ref([])
const opponentIndexes = ref([])
const occupiedIndexes = ref([])
const isCorrect = ref(null)

// gsap refs
const grid = ref()

watch(() => props.currentAnswer, (currentGuess, previousGuess) => {
    if( currentGuess.isEmpty === true ) {
        console.log('empty guess by' + currentGuess.playerId)
        emit('playerGuess', {
            isEmpty: true,
            'playerId': currentGuess.playerId,
            isCorrect: false,
        })
    } else {
        console.log('It is not an empty guess by' + currentGuess.playerId)
        checkAnswer(currentGuess)
    }
});

// watch(()=> props.resetGrid, (currentGuess, previousGuess) => {
    // grids.forEach((grid) => {
    //     if(grid.value.classList.contains('bg-green')) {
    //         grid.value.classList.remove('bg-green')
    //     } else if(grid.value.classList.contains('bg-blue')) {
    //         grid.value.classList.remove('bg-blue')
    //     }
    // })
    // playerIndexes.value = []
    // opponentIndexes.value = []
    // occupiedIndexes.value = []
// });


const OneByOne = ref(null)
const OneByTwo = ref(null)
const OneByThree = ref(null)
const TwoByOne = ref(null)
const TwoByTwo = ref(null)
const TwoByThree = ref(null)
const ThreeByOne = ref(null)
const ThreeByTwo = ref(null)
const ThreeByThree = ref(null)

const grids = [
    OneByOne,
    TwoByOne,
    ThreeByOne,
    OneByTwo,
    TwoByTwo,
    ThreeByTwo,
    OneByThree,
    TwoByThree,
    ThreeByThree,
]

const localArray = props.gridAnswers

const checkAnswer = (answer) => {
    outerloop: for (let [ind, elem] of localArray.entries()) {
        if (occupiedIndexes.value.includes(ind)) continue
        for (let e of elem) {
            if (e.id === answer.id) {
                occupiedIndexes.value.push(ind)
                if(answer.playerId === localStorage.getItem('id')) {
                    playerIndexes.value.push(Number(grids[ind].value.dataset.number))
                    const winner = checkWinner(playerIndexes.value, playerIndexes.value.length, 15)
                    if(winner){
                        emit('gameEnded', {
                            winner: answer.playerId,
                            isDraw: false
                        })
                    } else if(winner === false && occupiedIndexes.value.length === 9) {
                        emit('gameEnded', {
                            isDraw: true
                        })
                    }
                    gsap.to(grids[ind].value.firstElementChild, {
                        duration: 0.5,
                        top: '-5px',
                        left: '-5px',
                        backgroundColor: store.getPlayerColor === 'blue' ? '#6B59D6' : '#82AF81',
                        ease: 'power2.inOut',
                    })
                } else {
                    opponentIndexes.value.push(Number(grids[ind].value.dataset.number))
                    const winner = checkWinner(opponentIndexes.value, opponentIndexes.value.length, 15)
                    if(winner){
                        emit('gameEnded', {
                            winner: answer.playerId,
                            isDraw: false
                        })
                    } else if(winner === false && occupiedIndexes.value.length === 9) {
                        console.log('draw')
                        emit('gameEnded', {
                            isDraw: true
                        })
                    }
                    gsap.to(grids[ind].value.firstElementChild, {
                        duration: 0.5,
                        top: '-5px',
                        left: '-5px',
                        backgroundColor: store.getOpponentColor === 'green' ? '#82AF81' : '#6B59D6',
                        ease: 'power2.inOut',
                    })
                }
                isCorrect.value = true
                break outerloop
            } else {
                isCorrect.value = false
            }

        }
    }

    if(isCorrect.value === true) {
        emit('playerGuess', {
                ...answer,
                isCorrect: true,
        })
    } else {
        emit('playerGuess', {
            ...answer,
            isCorrect: false,
        })
    }
}

const checkWinner = (A, arr_size, sum)=>{
        for (let i = 0; i < arr_size - 2; i++) {
            let s = new Set();
            let curr_sum = sum - A[i];
            for (let j = i + 1; j < arr_size; j++) 
            {
                if (s.has(curr_sum - A[j])) 
                { 
                    return true;
                }
                s.add(A[j]);
            }
        }
        return false;
}

</script>


<style scoped>
.tile {
    @apply flex flex-col justify-center items-center flex-wrap aspect-square text-sm sm:text-sm md:text-base transition duration-500 ease-in-out delay-150
}

.innerCell {
    @apply outline outline-lightBlack outline-2
}

.outerCell {
    @apply text-[11px]  sm:text-xs md:text-sm lg:text-base text-center
}

</style>