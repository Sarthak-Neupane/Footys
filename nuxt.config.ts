// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "@pinia/nuxt",
  ],

  ssr: true,
  
  nitro: {
    plugins: ["~/server/plugins/mongo.js", "~/server/plugins/socket.js"],
  },

  runtimeConfig: {
    mongodbURI: process.env.MONGODB_URI,
  },

  colorMode: {
    classSuffix: "",
  },

  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
    ],
  },

  build: {
    transpile: ['gsap'],
  },

  css: ["~/assets/fonts/Audiowide.css"],
});
