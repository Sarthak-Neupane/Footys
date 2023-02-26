<template>
    <h1 class="text-center">
        <span class="text-lightBlack">Fic</span>
        <span class="text-lightBlack">Fac</span>
        <span :class="`text-${foeColor}`">Foe</span>
    </h1>
</template>


<script setup>
const props = defineProps({
    foeColor: {
        type: String,
        required: true,
        default: 'blue'
    }
})
</script>