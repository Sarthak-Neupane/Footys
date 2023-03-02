<template>
        <div class="px-5 py-4 2xl:px-12 2xl:text-4xl 2xl:py-10 text-lightBlack rounded-md outline outline-2 outline-lightBlack relative"
            :class="[backgroundBack ? `bg-${backgroundBack}` : '', cursor, groupName]">
            <div class="invisible">
                <slot></slot>
            </div>
            <div class="absolute px-5 py-4 2xl:px-12 2xl:text-4xl 2xl:py-10 h-full w-full transition-all rounded-md outline outline-2 outline-lightBlack text-center flex justify-center items-center text-lightWhite"
                :class="[backgroundFront ? `bg-${backgroundFront}` : '', cursor, !grounded ? translateXup : '', !grounded ? translateYleft : '', groupHover ? translateXdown : '', groupHover ? translateYright : '' ]">
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
    },
    grounded: {
        type: Boolean,
        required: true,
        default: false
    }
})

const translateXup = `-top-3`
const translateYleft = `-left-3`
const translateXdown = `${props.groupName}-hover:top-0`
const translateYright = `${props.groupName}-hover:left-0`

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
