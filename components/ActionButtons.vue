<template>
    <div class="flex justify-center items-center gap-8">
        <!-- <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg  py-2 px-6" @click="$emit('newGame')">
            Play Again
        </base-button> -->
        <base-card @click="$emit('newGame')" background-back="bg-lightWhite" :background-front="getPlayerColor"
            cursor="cursor-pointer" :group-hover=true group-name="group" :grounded=false> PLAY AGAIN</base-card>
        <base-card @click="routePush()" background-back="bg-lightWhite" :background-front="getPlayerColor"
            cursor="cursor-pointer" :group-hover=true group-name="group" :grounded=false> HOME </base-card>
    </div>
    <div class="w-full">
        <button class="bg-[#00ACEE] w-full text-lightWhite py-3"> TWEET YOUR RESULTS </button>
    </div>
</template>

<script setup>
import { useGameStore } from '@/store/';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

defineEmits(['newGame'])

const store = useGameStore();
const { getPlayerColor } = storeToRefs(store);

const $router = useRouter();


const routePush = () => {
    $router.push('/')
}
</script>