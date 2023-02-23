<template>
        <div class="w-1/2 border-solid border-r-[0px] border-lightBlack">
            <TransitionGroup name="list" tag="ul" class="w-full flex flex-col justify-start items-start" @before-enter="onBeforeEnter">
                <li v-for="guess in getPlayerGuesses" :key="guess._id" class="guess"
                    :class="guess.isCorrect === true ? 'text-green' : 'text-lightBlack'"> {{ guess.name }} </li>
            </TransitionGroup>
        </div>

    <div class=" w-1/2">
            <TransitionGroup name="list" tag="ul" class="w-full flex flex-col justify-start items-start text-right" @before-enter="onBeforeEnter">
                <li v-for="guess in getOpponentGuesses" :key="guess._id" class="guess"
                    :class="guess.isCorrect === true ? 'text-blue' : 'text-lightBlack'"> {{ guess.name }} </li>
            </TransitionGroup>
    </div>
</template>

<script setup>
import { useGameStore } from '@/store/';
import { storeToRefs } from 'pinia'

const store = useGameStore();
const { getPlayerGuesses } = storeToRefs(store)
const { getOpponentGuesses } = storeToRefs(store)

function onBeforeEnter(el) {
    if(el.classList.contains('text-lightBlack')){
        el.classList.add('animation')
    }
    // console.log(el)
}

</script>

<style scoped>
.guess {
    @apply text-sm py-1 w-full sm:text-base sm:py-2 md:py-3
}

.list-move,
.list-enter-active,
.list-leave-active {

    transition: all;
    transition-duration: 500ms;
    transition-delay: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.animation{
    animation: vibrate 500ms cubic-bezier(0.4, 0, 0.2, 1);
    animation-delay: 150ms;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.list-leave-active {
  position: absolute;
}

@keyframes vibrate {

0% {
  transform: translateX(0)
}

25% {
  transform: translateX(5px)
}

50% {
  transform: translateX(-5px)
}

75% {
  transform: translateX(5px)
}

100% {
  transform: translateX(0)
}

}
</style>