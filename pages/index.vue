<template>
  <div class="h-screen grid content-center">
    <div class="container sm:bg-darkWhite flex flex-col justify-center items-center gap-20 mx-auto">
      <logo-name class="font-black text-6xl"></logo-name>
      <div class="flex flex-col justify-center items-center gap-8 text-center text-3xl">
        <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg w-60 py-2"> How To Play
        </base-button>
        <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg w-60 py-2"> Play Online
        </base-button>
        <base-button class="bg-none text-green border-solid border-blue border-2 rounded-lg w-60 py-2"> Play A Friend
        </base-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'


const getData = async () => {
  const data = await $fetch('/api/Clubs/getClubs')
  console.log(data)
}
</script>