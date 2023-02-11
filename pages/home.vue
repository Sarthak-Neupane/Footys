<template>
    <div class="flex justify-center flex-col items-center gap-12">
      <button class="border-2 border-red-400 border-solid" @click="summonClub()">Console a Clubs Api</button>
      <button class="border-2 border-red-400 border-solid" @click="summonLeague()">Console a Leagues Api</button>
      <button class="border-2 border-red-400 border-solid" @click="summonPlayer()">Console a Player Api</button>
    </div>
  </template>
  
  <script setup>
  // import { ref } from "vue";
  // const counter = ref(0);
  
  const summonClub = async () => {
    const res = await $fetch("/api/Clubs");
    console.log(res);
  };
  const summonLeague = async () => {
    const res = await $fetch("/api/Leagues");
    console.log(res);
  };
  const summonPlayer = async () => {
    const res = await $fetch("/api/Players");
    console.log(res);
  };
  </script>
  