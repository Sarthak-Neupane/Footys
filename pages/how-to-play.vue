<template>
    <div class="bg-green">
        <div class="container mx-auto px-7 py-10 min-h-screen md:w-3/4 flex justify-center items-center flex-col gap-10">
            <logo-name class="font-black text-6xl" foe-color="blue" @click-logo="clickLogo()"></logo-name>
            <TransitionGroup :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave"
                tag="ul" class="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <li v-for="(inst, index) in Instructions" :key="inst.Instruction" :data-index="index" >
                    <base-card class="aspect-square"
                        background-back="lightWhite" background-front="blue" cursor="cursor-default" :groupHover="false"
                        groupName="card" :grounded=false>
                        <div class="flex flex-col justify-center items-center gap-5 w-full">
                            <h3 class="text-xs md:text-sm lg:text-base 2xl:text-xl font-thin text-center"> {{ inst.text }} </h3>
                            <img :src="images[inst.imageName]" class="w-5/6 sm:w-4/5">
                        </div>
                    </base-card>
                </li>
            </TransitionGroup>
            <nuxt-link to="/">
                <base-card background-back="lightWhite" background-front="blue" cursor="cursor-pointer" :group-hover=true
                    group-name="group" :grounded="false"> LET'S PLAY </base-card>
            </nuxt-link>
        </div>
    </div>
</template>

<script setup>
import { filename } from 'pathe/utils';
import { useRouter } from 'vue-router';
import gsap from 'gsap';

const $router = useRouter();

const clickLogo = () => {
    $router.push('/')
}

const onBeforeEnter = (el) => {
console.log(el)
  el.style.opacity = 0
}

const onEnter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}

const onLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}

const glob = import.meta.glob('~/assets/images/Desktop/*.png', { eager: true });
const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value.default])
);
const imageNames = Object.keys(images);

const Instructions = [
    {
        index: 0,
        Instruction: "Instruction 1",
        text: "There are 9 boxes corresponding to two clubs (one from the first row and other from the first column)",
        imageName: imageNames[1]
    },
    {
        index: 1,
        Instruction: "Instruction 2",
        text: "Guess the correct player who played for both the clubs that correspond to a certain box",
        imageName: imageNames[3]
    },
    {
        index: 2,
        Instruction: "Instruction 3",
        text: "If the guess is correct, the specific box will be filled up with a color you are specified. If the guess is wrong, the game goes on and the other person will get a chance to guess",
        imageName: imageNames[2]
    },
    {
        index: 3,
        Instruction: "Instruction 4",
        text: "The game continues like a classic game of tic-tac-toe. The first person to fill up a row, column or diagonal with their color wins the game",
        imageName: imageNames[0]
    },
]



</script>
<!-- 
<style scoped>
.box-enter-active,
.box-leave-active {
    transition: all 0.5s ease;
}

.box-enter-from,
.box-leave-to {
    opacity: 0;
    /* transform: translateX(30px); */
}
</style> -->