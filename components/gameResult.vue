<template>
    <h1 class="font-black text-center text-4xl lg:text-6xl" v-if="getGameResult != 'draw'">
        <span :class="returnClass"> YOU </span><span :class="returnClass">{{ isWinner ? 'WIN' :
            'LOSE'
        }}</span>
    </h1>
    <h1 class="font-black text-center text-4xl lg:text-6xl" v-else>
        <span class="text-lightBlack"> Oops! YOU DREW </span>
    </h1>
</template>

<script setup>
import { useGameStore } from '~~/store/gameStore';
import { useMainStore } from '~~/store/mainStore';
import { storeToRefs } from 'pinia';

const store = useGameStore()
const mainStore = useMainStore()

const { getWinner, getGameResult } = storeToRefs(store)

const isWinner = computed(() => {
    return getWinner.value == mainStore.getMyId
})

// computed to return the player color class name
const returnClass = computed(() => {
  if (isWinner) {
    return `text-${mainStore.getMyColor}`
  } else {
    return 'text-lightBlack'
  }
})

</script>