<template>
    <ClientOnly>
        <Transition name="slide-fade">
            <div class="w-9/12 fixed top-5 left-1/2 -translate-x-1/2" v-if="error.value">
                <base-card class="" background-back="lightWhite" background-front="blue" cursor="cursor-default"
                    :group-hover=false group-name="card" :grounded=false>
                    {{ error.message }} </base-card>
            </div>
        </Transition>
    </ClientOnly>
    <section class="h-screen bg-green w-full flex justify-center items-center">
        <form class="flex justify-center items-center gap-14 flex-col w-full">
            <logo-name class="font-black text-6xl xl:text-8xl" foe-color="blue"></logo-name>
            <div class="flex flex-col items-start justify-center gap-5 lg:w-1/3">
                <label for="name" class="text-xl 2xl:text-3xl font-semibold">Enter Your Name</label>
                <input type="text" name="name" id="name"
                    class="py-3 xl:py-6 2xl:py-7 2xl:text-xl rounded-lg bg-lightWhite border-2 border-darkBlack px-3 focus:outline-none lg:w-full"
                    v-model.trim="name" />
            </div>
            <div class="lg:flex-row lg:gap-5 lg:w-1/3 w-full flex flex-col gap-10 justify-between items-center 2xl:text-lg">
                <base-card class="w-1/2" @click="save" background-back="lightWhite" background-front="blue"
                    cursor="cursor-pointer" :group-hover=true group-name="group" :grounded=false> Save
                </base-card>
                <base-card @click="routerPush" class="w-1/2" background-back="lightWhite" background-front="blue"
                    cursor="cursor-pointer" :group-hover=true group-name="group" :grounded=false> Lets Play
                </base-card>
            </div>
        </form>
    </section>
</template>

<script setup>
import filter from 'bad-words'
import { useSettingStore } from '~~/store/settings'
import { useMainStore } from '~~/store/mainStore';
import { useRoute, useRouter } from 'vue-router';

const { $socket } = useNuxtApp();

const badWord = new filter()

const settingStore = useSettingStore()
const mainStore = useMainStore()

const $route = useRoute()
const $router = useRouter()

const name = ref('')

const error = reactive({
    value: false,
    message: ''
})

const routerPush = () => {
    $router.push('/')
}

const validate = () => {
    if (badWord.isProfane(name.value)) {
        return {
            message: 'Name is not valid, please enter a valid name',
            containsProfanity: true
        }
    } else {
        if (name.value.length < 3) {
            return {
                message: 'Name is too short, please enter a name greater than 3 characters',
                tooShort: true,
                containsProfanity: false
            }
        } else if (name.value.length > 15) {
            return {
                message: 'Name is too long, please enter a less than 15 characters',
                tooLong: true,
                containsProfanity: false
            }
        }
        else {
            return {
                message: 'Name is valid',
                tooLong: false,
                tooShort: false,
                containsProfanity: false
            }
        }
    }
}

const save = () => {
    const validated = validate()
    if (validated.tooLong || validated.tooShort || validated.containsProfanity) {
        error.value = true
        error.message = validated.message
    } else {
        error.value = false
        error.message = ''
        settingStore.setName(name.value)
        $socket.emit('setCustomName', name.value, (res)=>{
            console.log(res)
            mainStore.setOpponentName(res.name)
        })
        setTimeout(()=>{
            error.value = true
            error.message = 'Name changed to ' + settingStore.getName
            name.value = ''
        }, 500)
    }
}
</script>

<style scoped>
.slide-fade-enter-active {
    transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translate(-50%, -100%);
}
</style>