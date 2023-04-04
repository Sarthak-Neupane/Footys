<template>
    <div class="grid grid-cols-4 grid-rows-4 content-center items-center w-full" ref="grid">
        <div class="tile outerCell"></div>
        <div class="tile outerCell">{{ rowClubs[0].name }}</div>
        <div class="tile outerCell">{{ rowClubs[1].name }}</div>
        <div class="tile outerCell ">{{ rowClubs[2].name }}</div>
        <div class="tile outerCell"> {{ columnClubs[0].name }} </div>

        <div class="tile innerCell relative " data-index="0" data-number="8" ref="OneByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite "> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>

        <div class="tile innerCell relative" data-index="3" data-number="1" ref="OneByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>

        <div class="tile innerCell relative" data-index="6" data-number="6" ref="OneByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile outerCell">{{ columnClubs[1].name }}</div>
        <div class="tile innerCell relative" data-index="1" data-number="3" ref="TwoByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-index="4" data-number="5" ref="TwoByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-index="7" data-number="7" ref="TwoByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile outerCell">{{ columnClubs[2].name }}</div>
        <div class="tile innerCell relative" data-index="2" data-number="4" ref="ThreeByOne">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-index="5" data-number="9" ref="ThreeByTwo">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
        <div class="tile innerCell relative" data-index="8" data-number="2" ref="ThreeByThree">
            <div class=" absolute border-2 border-solid border-lightBlack h-full w-full bg-lightWhite"> </div>
            <div class="h-full w-full bg-lightBlack top-0 left-0"></div>
        </div>
    </div>
</template>


<script setup>
import { useGridStore } from '~~/store/gridStore';
import { storeToRefs } from 'pinia';

const gridStore = useGridStore()

const { columnClubs, rowClubs } = storeToRefs(gridStore)


</script>


<style scoped>
.tile {
    @apply flex flex-col justify-center items-center flex-wrap aspect-square text-sm sm:text-sm md:text-base transition duration-500 ease-in-out delay-150
}

.innerCell {
    @apply outline outline-lightBlack outline-2
}

.outerCell {
    @apply text-[11px]  sm:text-xs md:text-sm lg:text-base text-center
}

</style>