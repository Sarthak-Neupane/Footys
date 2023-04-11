<template>
    <div class=" w-1/2 absolute z-10 top-5 left-1/2 -translate-y-0 -translate-x-1/2">
        <base-card class="" background-back="lightWhite" :background-front="backgroundFront" cursor="cursor-default" :group-hover=false
            group-name="card" :grounded=false>
            <slot></slot>
        </base-card>
    </div>
</template>

<script setup>

const props = defineProps({
    backgroundFront: {
        type: String,
    },
})
</script>