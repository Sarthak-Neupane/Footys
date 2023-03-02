<template>
    <svg height="100" width="100" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <circle cx="50" cy="50" :r="radius" :stroke="fill" stroke-width="10" :stroke-dasharray="strokeDashArray"
            :stroke-dashoffset="strokeDashOffsetValue" fill="none" class="-rotate-90 origin-center" />
    </svg>
    <p class="font-bold text-lg sm:text-xl md:text-2xl"> {{ getTimer }} </p>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useGameStore } from '~~/store/gameStore';

const store = useGameStore();
const { getTimer } = storeToRefs(store);
const { getPlayerColor, getOpponentColor } = storeToRefs(store);
const { playerTurn } = storeToRefs(store);

const radius = 40

const fill = computed(() => {
    if(playerTurn.value){
        if(getPlayerColor.value === 'green') {
            return '#82AF81'
        } else {
            return '#6B59D6'
        }
    } else {
        if(getOpponentColor.value === 'green') {
            return '#82AF81'
        } else {
            return '#6B59D6'
        }
    }
})

const strokeDashArray = computed(() => {
    return 2 * radius * Math.PI
})

const strokeDashOffsetValue = computed(() => {
    return (strokeDashArray.value / 30) * (getTimer.value - 30)
})

</script>