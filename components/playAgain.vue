<template>
    <div class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed font-['audiowide']">
        <base-card class="py-7 px-20 aspect-video 2xl:w-2/5 2xl:h-2/5" background-back="lightWhite" background-front="blue"
            cursor="cursor-default" :groupHover="false" groupName="card" :grounded=false>
            <div class="flex flex-col justify-center items-center gap-14 2xl:w-full 2xl:h-full 2xl:justify-between">
                <Transition mode="out-in">
                    <div class="text-2xl font-bold text-center 2xl:text-5xl"> {{ matchmakingText }} </div>
                </Transition>
                <div class="animate-spin rounded-full h-24 w-24 border-t-8 border-b-8 border-l-8 border-r-2 border-green">
                </div>
                <base-card class="px-6 text-xl" @click="cancelSearch" background-back="lightWhite" background-front="green"
                    :groupHover="true" groupName="group" :grounded=false> CANCEL
                </base-card>
            </div>
        </base-card>
    </div>
</template>

<script setup>
import { useMainStore } from '~~/store/mainStore';
import { useGameStore } from '~~/store/gameStore';
import { useGridStore } from '~~/store/gridStore';

import { useRoute, useRouter } from 'vue-router';

const props = defineProps(['action'])
const emits = defineEmits(['cancel-join'])

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

const findAGame = () => {
    gameFound.value = false;
    matchmakingText.value = 'FINDING A GAME'
    const delayTime = setTimeout(() => {
        $socket.emit('joinLobby', { id: mainStore.getMyId })
    }, 1000)
    timeout.value = delayTime
}

const cancelSearch = () => {
    gameFound.value = false;
    clearTimeout(timeout.value)
    $socket.emit('leaveLobby', { id: mainStore.getMyId })
    emits('cancel-join')
}

$socket.on('lobbyJoined', (data) => {
    console.log('lobby joined')
    mainStore.setMySocketId(data.playerSocketId)
})

$socket.on('gameFound', (data) => {
    if (data.players.includes(mainStore.getMySocketId)) {
        matchmakingText.value = 'Game Found'
        gameFound.value = true
        $socket.emit('joinGame', { id: mainStore.getMyId, gameId: data.gameId })
    }
})

$socket.on('gameJoined', (data) => {
    matchmakingText.value = `Joining game...`
})

$socket.on('bothPlayersJoined', (data) => {
    if (data.isJoined) {
        console.log(data)
        const interval = setInterval(() => {
            if (joiningGameIn.value > 0) {
                matchmakingText.value = `Joining in ${joiningGameIn.value}...`
                joiningGameIn.value -= 1
            } else {
                clearInterval(interval)
                joiningGameIn.value = 3
                // set the game id to the store.
                gameStore.setGameId(data.gameId)

                // set the gameData to store
                gridStore.setColumnClubs(data.gameData.columnClubs)
                gridStore.setRowClubs(data.gameData.rowClubs)

                $router.push(`/game/${data.gameId}`)
            }
        }, 1000)
    }
})

watch(props, (newProps) => {
    console.log('new props', newProps)
    if (newProps.action) {
        findAGame()
    }
}, {
    deep: true,
    immediate: true
})

</script>


<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>