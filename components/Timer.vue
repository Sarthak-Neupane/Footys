<template>
    <svg height="100" width="100" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" ref="circle">
        <circle cx="50" cy="50" :r="radius" :stroke="fill" stroke-width="10" :stroke-dasharray="strokeDashArray"
             fill="none" class="-rotate-90 origin-center" />
    </svg>
    <p class="font-bold text-lg sm:text-xl md:text-2xl"> {{ getTimer }} </p>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMainStore } from '~~/store/mainStore';
import { useTimerStore } from '~~/store/timerStore';

import gsap from 'gsap';


const ctx = ref(null)
const circle = ref(null)

const mainStore = useMainStore();
const timerStore = useTimerStore();
const { getTimer } = storeToRefs(timerStore);

const radius = 40

const fill = computed(() => {
    if (mainStore.getMyTurn) {
        if (mainStore.getMyColor === 'green') {
            return '#82AF81'
        } else {
            return '#6B59D6'
        }
    } else {
        if (mainStore.getOpponentColor === 'green') {
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

watch(getTimer, (newVal) => {
    ctx.value = gsap.context((self) => {
        const element = self.selector('circle')
        gsap.to(element[0], {
            strokeDashoffset: strokeDashOffsetValue.value,
            duration: 1,
            ease: 'none'
        })
    }, circle.value)
})


</script>