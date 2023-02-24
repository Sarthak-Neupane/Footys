<template>
    <div class="flex justify-center items-center gap-8">
        <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg  py-2 px-6" @click="$emit('newGame')">
            Play Again
        </base-button>
        <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg  py-2 px-6">
            Home
        </base-button>
    </div>
    <div class="w-full">
        <button class="bg-[#00ACEE] w-full text-lightWhite py-3"> Tweet Your Results </button>
    </div>
</template>

<script setup>
    defineEmits(['newGame'])
</script>