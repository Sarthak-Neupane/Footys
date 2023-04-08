<template>
    <div class="flex justify-center items-center gap-8">
        <base-card @click="$emit('newGame')" background-back="bg-lightWhite" :background-front="getMyColor"
            cursor="cursor-pointer" :group-hover=true group-name="group" :grounded="false"> PLAY AGAIN</base-card>
        <base-card @click="routePush()" background-back="bg-lightWhite" :background-front="getMyColor"
            cursor="cursor-pointer" :group-hover=true group-name="group" :grounded=false> HOME </base-card>
    </div>
    <div class="w-full">
        <button class="bg-[#00ACEE] w-full text-lightWhite py-3"> TWEET FEATURE COMING SOON ... </button>
    </div>
</template>

<script setup>
import { useMainStore } from '~~/store/mainStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

defineEmits(['newGame'])

defineProps({
    error: {
        type: Boolean,
        default: false
    }
})

const mainStore = useMainStore();
const { getMyColor } = storeToRefs(mainStore);

const $router = useRouter();

const routePush = () => {
    $router.push('/')
}
</script>