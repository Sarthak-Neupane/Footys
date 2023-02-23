<template>
    <div class="absolute bottom-full left-0 w-full">
        <ul>
            <li v-for="player in players" :key="player._id"
                class="bg-[#fafafa] py-3 px-1 text-sm font-normal text-lightBlack border-[1px] border-solid border-lightBlack hover:bg-green hover:text-lightWhite cursor-pointer"
                :data-id="player._id" @click="submitAnswer($event)">
                {{ player.name }} - {{ player.position }}
            </li>
        </ul>
    </div>
    <input type="text" id="playerSearch" v-model.trim="searchValue" @input="checkTyping()"
        class="border-solid border-lightBlack focus:outline-none border-b-2 w-full px-5 py-3" :class="`focus:border-${playerColor}`" />
    <label for="playerSearch"
        class="absolute w-full top-1/2 left-0 -translate-y-2/4 pointer-events-none text-xs sm:text-base px-5 text-lightBlack">
        {{ labelInput }}</label>
    <Icon name="icons8:sort-down" class="absolute top-1/2 right-0 -translate-y-2/4 -translate-x-full pointer-events-none" />
</template>


<script setup>
import { useGameStore } from '@/store/';
import { storeToRefs } from 'pinia';

const emit = defineEmits({
  submitAnswer(payload) {
    if(payload === undefined) return false
    return true
  }
})

const store = useGameStore();
const { playerColor } = storeToRefs(store);

const searchValue = ref('');
const labelInput = ref("Search Player");
const players = ref([])


const checkTyping = async () => {
    if (searchValue.value.length > 0) {
        labelInput.value = "";
    } else {
        labelInput.value = "Search Player";
    }
    if (searchValue.value.length > 0) {
        const results = await $fetch(`/api/Game/getPlayers?value=${searchValue.value}`, {
            method: 'get',
        });
        players.value = results.players;
    } else {
        players.value = []
    }
};

const submitAnswer = (e) => {
    players.value.forEach((elem) => {
        if (elem._id === e.target.dataset.id) {
            emit('submitAnswer', elem)
            players.value = []
            searchValue.value = ''
            labelInput.value = "Search Player";
        }
    })
}
</script>
