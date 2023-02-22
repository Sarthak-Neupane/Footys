<template>
    <svg height="100" width="100" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <circle cx="50" cy="50" :r="radius" stroke="rgb(130 175 129)" stroke-width="10" :stroke-dasharray="strokeDashArray"
            :stroke-dashoffset="strokeDashOffset" fill="none" class="-rotate-90 origin-center" />
    </svg>
    <p class="font-bold text-lg sm:text-xl md:text-2xl">15</p>
</template>

<script setup>
const strokeDashOffset = ref(-63)
const radius = 40

const strokeDashArray = computed(() => {
    return 2 * radius * Math.PI
})

</script>