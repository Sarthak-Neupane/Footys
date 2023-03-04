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
  },

  runtimeConfig: {
    mongodbURI: process.env.MONGODB_URI,

    public: {
      baseURL : process.env.BASE_URL || "http://localhost:8000",
    }
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

  build: {
    transpile: ['gsap'],
  },

  css: ["~/assets/fonts/Audiowide.css"],
});
