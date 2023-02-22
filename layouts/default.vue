<template>
    <div class="font-[Inter]">
        <slot> </slot>
    </div>
</template>

<script setup>
const toggle = ref(false)
const colorMode = useColorMode()
</script>