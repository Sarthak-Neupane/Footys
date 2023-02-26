<template>
        <div class="px-5 py-4 text-lightBlack rounded-md outline outline-2 outline-lightBlack relative"
            :class="[backgroundBack, cursor, groupName]">
            <slot></slot>
            <div class="absolute px-5 py-4 h-full w-full -top-3 -left-3 transition-all rounded-md outline outline-2 outline-lightBlack text-center flex justify-center items-center text-lightWhite"
                :class="[backgroundFront, cursor, groupHover ? translateXdown : '', groupHover ? translateYdown : '' ]">
                <slot></slot>
            </div>
        </div>
</template>

<script setup>


const props = defineProps({
    backgroundFront: {
        type: String,
        default: 'bg-blue'
    },
    backgroundBack: {
        type: String,
        default: 'bg-lightWhite'
    },
    cursor: {
        type: String,
        default: 'cursor-pointer'
    },
    groupName: {
        type: String,
        default: 'group'
    },
    groupHover: {
        type: Boolean,
        default: false
    }
})

const translateXdown = `${props.groupName}-hover:top-0`
const translateYdown = `${props.groupName}-hover:left-0`

// watch(() => props.groupHover, (current, previous) => {
//     if (current) {
        
//     }
// })

</script>


<style scoped>
.group:hover .group-hover\:top-0 {
    top: 0px;
}
.group:hover .group-hover\:left-0 {
    left: 0px;
}

.group:hover:after {
  content: '';
  position: absolute;
  left: -12px;
  top: -12px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

</style>
