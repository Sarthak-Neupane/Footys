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
    plugins: ["~/server/index.js"],
    preset: 'node-server',
  },

  runtimeConfig: {
    mongodbURI: process.env.MONGODB_URI,
  },

  colorMode: {
    classSuffix: "",
    preference: "system",
    // fallback: 'light',
  },

  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
    ],
  },

  css: ["~/assets/fonts/Inter.css"],
});
