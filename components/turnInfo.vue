<template>
    <div>
        <Transition name="earlyFade" mode="out-in">
            <div class="w-full flex justify-center items-center gap-10" v-if="getMyTurn">
                <base-card background-back="lightWhite" :background-front="mainStore.getMyColor" cursor="cursor-default"
                    :group-hover=false group-name="card" :grounded=false> YOUR PLAY </base-card>
            </div>
            <div class="w-full flex justify-center items-center gap-10" v-else>
                <base-card background-back="lightWhite" :background-front="mainStore.getOpponentColor" cursor="cursor-default"
                    :group-hover=false group-name="card" :grounded=false> OPPONENT PLAY
                </base-card>
            </div>
        </Transition>
        <div class="relative h-20 w-20 flex justify-center items-center">
            <Timer />
        </div>
    </div>
</template>

<script setup>
import { useMainStore } from '~~/store/mainStore';
defineProps(['getMyTurn'])

const mainStore = useMainStore();
</script>

<style scoped>
.earlyFade-enter-active,
.earlyFade-leave-active {
  transition: all;
  transition-duration: 300ms;
  transition-delay: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.earlyFade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.earlyFade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>