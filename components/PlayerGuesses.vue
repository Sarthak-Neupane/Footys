<template>
  <div class="w-1/2 border-solid border-r-[0px] border-lightBlack">
    <TransitionGroup name="list" tag="ul" class="w-full flex flex-col justify-start items-start"
      @before-enter="onBeforeEnter">
      <li v-for="guess in localPlayerGuessList" :key="guess.meta.answer.isEmpty ? 'NoKeyP' : guess.meta.answer._id" class="guess" :class="returnPlayerClass(guess.result)"> {{ !guess.meta.answer.isEmpty ? guess.meta.answer.name : 'N/A'  }} </li>
    </TransitionGroup>
  </div>

  <div class=" w-1/2">
    <TransitionGroup name="list" tag="ul" class="w-full flex flex-col justify-start items-start text-right"
      @before-enter="onBeforeEnter">
      <li v-for="guess in localOpponentGuessList" :key="guess.meta.answer.isEmpty ? 'NoKeyO' : guess.meta.answer._id" class="guess" :class="returnOpponentClass(guess.result)"> {{ !guess.meta.answer.isEmpty ? guess.meta.answer.name : 'N/A' }} </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useGridStore } from '~~/store/gridStore';
import { useMainStore } from '~~/store/mainStore';
import { storeToRefs } from 'pinia'

const mainStore = useMainStore();
const gridStore = useGridStore();

const localPlayerGuessList = ref([])
const localOpponentGuessList = ref([])

gridStore.$subscribe((mut, state)=>{
  if(state.currentAnswer.meta.player === localStorage.getItem('id')){
    localPlayerGuessList.value.push(state.currentAnswer) 
  } else {
    localOpponentGuessList.value.push(state.currentAnswer)
  }
})

const { getMyColor } = storeToRefs(mainStore)
const { getOpponentColor } = storeToRefs(mainStore)

const returnPlayerClass = (guess) => {
  if (guess.correct === true) {
    if (getMyColor.value === 'green') { return 'text-green' } else { return `text-blue` }
  } else {
    return 'text-lightBlack'
  }
}

const returnOpponentClass = (guess) => {
  if (guess.correct === true) {
    if (getOpponentColor.value === 'green') { return 'text-green' } else { return `text-blue` }
  } else {
    return 'text-lightBlack'
  }
}

function onBeforeEnter(el) {
  if (el.classList.contains('text-lightBlack')) {
    el.classList.add('animation')
  }
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

.animation {
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

}</style>