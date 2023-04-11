<template>
    <section class="h-full w-full bg-darkWhite flex justify-center items-center relative" ref="container">
        <div class=" w-full flex justify-between items-stretch gap-14 flex-col">
            <h1 class="py-4 text-3xl text-blue font-bold" id="player1">  {{ settingStore.getName }} </h1>
            <h1 class="py-4 text-center text-6xl font-black" id="vs">
                <span class="text-green">V</span>
                <span class="text-blue">S</span>
            </h1>
            <h1 class="py-4 text-right text-3xl text-green font-bold" id="player2">{{ mainStore.getOpponentName }}</h1>
        </div>
        <div class="absolute top-5 left-1/2 -translate-x-1/2 text-3xl" id="time">
            {{time}}
        </div>
    </section>
</template>

<script setup>
import gsap from 'gsap';
import { useSettingStore } from '~~/store/settings';
import { useMainStore } from '~~/store/mainStore';

const ctx = ref(null);
const container = ref(null);
const time = ref(3);

const settingStore = useSettingStore();
const mainStore = useMainStore();

const emits = defineEmits(['animComplete'])

onMounted(()=>{
    ctx.value = gsap.context((self)=>{
        const playerOne = self.selector('#player1');
        const playerTwo = self.selector('#player2');
        const vs = self.selector('#vs');
        const tl = gsap.timeline({
            onComplete: ()=>{
                emits('animComplete')
            },
            onUpdate: ()=>{
                time.value = 4 - (Math.floor(tl.time()) + 1)
            }
        })

        tl.fromTo(playerOne, {x: -100, opacity: 0, duration: 4}, {x: 100, opacity: 1, duration: 1})
        .fromTo(playerTwo, {x: 100, opacity: 0, duration: 4}, {x: -100, opacity: 1, duration: 1}, '-=1')
        .fromTo(vs, {opacity: 0, scale: 5, duration: 1}, {opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)'})

    }, container.value)
})

</script>