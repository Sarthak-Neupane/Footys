<template>
    <div class="grid grid-cols-4 grid-rows-4 content-center items-center w-full" ref="grid">
        <div class="tile outerCell"></div>
        <div class="tile outerCell">{{ rowClubs[0].name }}</div>
        <div class="tile outerCell">{{ rowClubs[1].name }}</div>
        <div class="tile outerCell ">{{ rowClubs[2].name }}</div>
        <div class="tile outerCell"> {{ columnClubs[0].name }} </div>

        <div class="tile innerCell relative " data-index="0" data-number="8" ref="OneByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite "> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>

        <div class="tile innerCell relative" data-index="3" data-number="1" ref="OneByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>

        <div class="tile innerCell relative" data-index="6" data-number="6" ref="OneByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile outerCell">{{ columnClubs[1].name }}</div>
        <div class="tile innerCell relative" data-index="1" data-number="3" ref="TwoByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-index="4" data-number="5" ref="TwoByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-index="7" data-number="7" ref="TwoByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile outerCell">{{ columnClubs[2].name }}</div>
        <div class="tile innerCell relative" data-index="2" data-number="4" ref="ThreeByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-index="5" data-number="9" ref="ThreeByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-index="8" data-number="2" ref="ThreeByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
    </div>
</template>


<script setup>
import gsap from 'gsap'

import { useGameStore } from '~~/store/gameStore';
import { useMainStore } from '~~/store/mainStore';
import { useGridStore } from '~~/store/gridStore';
import { storeToRefs } from 'pinia';

const grid = ref()

const gameStore = useGameStore()
const gridStore = useGridStore()
const mainStore = useMainStore()
const { columnClubs, rowClubs } = storeToRefs(gridStore)

const occupiedPlayerAnswerIndexes = ref([])
const occupiedPlayerGridNumbers = ref([])

const occupiedOpponentAnswerIndexes = ref([])
const occupiedOpponentGridNumbers = ref([])

const emits = defineEmits(['animationComplete'])

gridStore.$subscribe((mutation, state) => {
    if (state.playerIndexes.length > 0) {
        const recentIndex = state.playerIndexes[state.playerIndexes.length - 1]
        console.log(occupiedPlayerAnswerIndexes.value)
        if (!occupiedPlayerAnswerIndexes.value.includes(recentIndex)) {
            occupiedPlayerAnswerIndexes.value.push(recentIndex)
            occupiedPlayerGridNumbers.value.push(getTheGridNumberFromAnswerIndex(recentIndex))
        }
    }

    if (state.opponentIndexes.length > 0) {
        const recentIndex = state.opponentIndexes[state.opponentIndexes.length - 1]
        if (!occupiedOpponentAnswerIndexes.value.includes(recentIndex)) {
            occupiedOpponentAnswerIndexes.value.push(recentIndex)
            occupiedOpponentGridNumbers.value.push(getTheGridNumberFromAnswerIndex(recentIndex))
        }
    }
})

const getTheGridNumberFromAnswerIndex = (answerIndex) => {
    const answerIndexElement = grid.value.querySelector(`[data-index="${answerIndex}"]`)
    const gridNumber = answerIndexElement.getAttribute('data-number')
    return Number(gridNumber)
}

watch(() => occupiedPlayerGridNumbers.value, (newVal, oldVal) => {
    newVal.forEach((number) => {
        const element = grid.value.querySelector(`[data-number="${number}"]`)
        gsapAnimation(element, true)
    })
}, {
    deep: true,
})

watch(() => occupiedOpponentGridNumbers.value, (newVal, oldVal) => {
    newVal.forEach((number) => {
        console.log('opponent', number)
        const element = grid.value.querySelector(`[data-number="${number}"]`)
        console.log(element)
        gsapAnimation(element, false)
    })
}, {
    deep: true,
})

const gsapAnimation = (element, playerTurn) => {
    const color = playerTurn ? mainStore.getMyColor : mainStore.getOpponentColor
    gsap.to(element.firstElementChild, {
        duration: 0.5,
        top: '-5px',
        left: '-5px',
        backgroundColor: color === 'blue' ? '#6B59D6' : '#82AF81',
        ease: 'power2.inOut',
    })
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
    @apply text-[11px] sm:text-xs md:text-sm lg:text-base text-center
}
</style>