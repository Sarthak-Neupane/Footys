<template>
    <div class=" font-['Audiowide']">
        <slot> </slot>
    </div>
</template>

<script setup>
const toggle = ref(false)
const colorMode = useColorMode()
</script>

<style>
.text-fill {
    -webkit-text-fill-color: #E2E2E2
}

.text-fill-transparent {
    -webkit-text-fill-color: transparent
}

.text-fill-black {
    -webkit-text-fill-color: #000
}

.text-fill-white {
    -webkit-text-fill-color: #fff
}

.text-stroke {
    -webkit-text-stroke-color: #E2E2E2
}

.text-stroke-transparent {
    -webkit-text-stroke-color: transparent
}

.text-stroke-black {
    -webkit-text-stroke-color: #000
}

.text-stroke-white {
    -webkit-text-stroke-color: #fff
}

.text-stroke {
    -webkit-text-stroke-width: .5px
}

.text-stroke-0 {
    -webkit-text-stroke-width: 0
}

.text-stroke-2 {
    -webkit-text-stroke-width: 2px
}

.text-stroke-4 {
    -webkit-text-stroke-width: 4px
}

.text-stroke-8 {
    -webkit-text-stroke-width: 8px
}

.paint-fsm {
    paint-order: fill stroke markers
}

.paint-fms {
    paint-order: fill markers stroke
}

.paint-sfm {
    paint-order: stroke fill markers
}

.paint-smf {
    paint-order: stroke markers fill
}

.paint-mfs {
    paint-order: markers fill stroke
}

.paint-msf {
    paint-order: markers stroke fill
}</style>