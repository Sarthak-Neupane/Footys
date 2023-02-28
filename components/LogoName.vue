<template>
    <h1 class="text-center">
        <!-- <div class="bg-red-300"> -->
            <span class="text-lightBlack cursor-pointer" @click="emitClick()">Fic</span>
            <span class="text-lightBlack cursor-pointer" @click="emitClick()">Fac</span>
            <span class="cursor-pointer" :class="getFoeColor" @click="emitClick()">Foe</span>
        <!-- </div> -->
    </h1>
</template>


<script setup>
const props = defineProps({
    foeColor: {
        required: true,
        default: 'blue'
    }
})

const emit = defineEmits(['clickLogo'])

const emitClick = () => {
    emit('clickLogo')
}

const getFoeColor = computed(() => {
    return `text-${props.foeColor}`
})
</script>