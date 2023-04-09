<template>
    <div class="">
        <base-card class="py-7 px-20 aspect-video w-full h-full" background-back="lightWhite" background-front="blue"
            cursor="cursor-default" :groupHover="false" groupName="card" :grounded=false>
            <div class="flex flex-col justify-center items-center gap-14 2xl:w-full 2xl:h-full 2xl:justify-between">
                <div class="text-2xl font-bold text-center 2xl:text-5xl"> {{ matchmakingText }} </div>
                <div class="animate-spin rounded-full h-24 w-24 border-t-8 border-b-8 border-l-8 border-r-2 border-green">
                </div>
                <base-card class="px-6 text-xl" @click="cancelSearch(true)" v-if="!gameFound" background-back="lightWhite"
                    background-front="green" :groupHover="true" groupName="group" :grounded=false> CANCEL
                </base-card>
            </div>
        </base-card>
    </div>
</template>

<script setup>
import { useMainStore } from '~~/store/mainStore';
import { useGameStore } from '~~/store/gameStore';
import { useGridStore } from '~~/store/gridStore';
import { useTimerStore } from '~~/store/timerStore';

import { useRoute, useRouter } from 'vue-router';

const mounted = ref(false)

const nowSearching = ref(false)

const props = defineProps(['action'])
const emits = defineEmits(['cancel-join', 'user-left'])

const $router = useRouter()
const $route = useRoute()

const { $socket } = useNuxtApp()

const mainStore = useMainStore()
const gameStore = useGameStore()
const gridStore = useGridStore()

const matchmakingText = ref('FINDING A GAME')
const gameFound = ref(null)
const joiningGameIn = ref(3)
const timeout = ref(0)
const currentInterval = ref(0)

onMounted(() => {
    mounted.value = true
    timeout.value = null
    currentInterval.value = null
    gameFound.value = false
    nowSearching.value = false
    findAGame()
})

const findAGame = () => {
    nowSearching.value = true
    gameFound.value = false;
    matchmakingText.value = 'FINDING A GAME'
    const delayTime = setTimeout(() => {
        $socket.emit('joinLobby', { id: mainStore.getMyId }, (data) => {
            if(nowSearching.value === false) {
                cancelSearch(false)
                return
            }
            console.log(data)
            console.log('joined lobby')
            mainStore.setMySocketId(data.playerSocketId)
            $socket.emit('findGame')
        })
    }, 1000)
    timeout.value = delayTime
}

const cancelSearch = (val) => {
    gameFound.value = false;
    clearTimeout(timeout.value)
    timeout.value = null
    $socket.emit('leaveLobby', { id: mainStore.getMyId }, (data) => {
        console.log(data)
        console.log('left lobby')
    })
    if(val){
        emits('cancel-join')
    } else {
        emits('user-left')
    }
}

$socket.on('gameFound', (data) => {
    if (data.players.includes(mainStore.getMySocketId) && mounted.value && !gameFound.value && nowSearching.value) {
        matchmakingText.value = 'Game Found'
        gameFound.value = true
        $socket.emit('joinGame', { id: mainStore.getMyId, gameId: data.gameId }, (data) => {
            console.log(data)
            console.log('joined game')
        })
    }
})

$socket.on('bothPlayersJoined', (data) => {
    if (data.isJoined) {
        const interval = setInterval(() => {
            if (joiningGameIn.value > 0) {
                matchmakingText.value = `Joining in ${joiningGameIn.value}...`
                joiningGameIn.value -= 1
                currentInterval.value = interval
            } else {
                clearInterval(interval)
                joiningGameIn.value = 3

                if(!nowSearching.value) {
                    cancelSearch(false)
                    return
                }
                // set the game id to the store.
                gameStore.setGameId(data.gameId)
                // set the gameData to store
                gridStore.setColumnClubs(data.gameData.columnClubs)
                gridStore.setRowClubs(data.gameData.rowClubs)
                console.log('both players joined, now pushing to game page')
                $router.push(`/game/${data.gameId}`)
            }
        }, 1000)
    }
})

$socket.on('cancelJoin', (data)=>{
    nowSearching.value = false
})

$socket.on('playerLeft', (data) => {
    console.log('user left')
    nowSearching.value = false
    cancelSearch(false)
    emits('user-left')
})

onUnmounted(() => {
    console.log('unmounted')
    clearInterval(currentInterval.value)
    mounted.value = false
})

</script>
