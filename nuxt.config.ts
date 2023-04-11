// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-icon',
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "@pinia/nuxt",
    // "~/modules/ws-server.js",
  ],

  ssr: true,
  
  nitro: {
    plugins: ["~/server/plugins/mongo.js"],
  },

  runtimeConfig: {
    mongodbURI: process.env.MONGODB_URI,

    public: {
      socketURL: process.env.SOCKET_URL || "http://localhost:8000",
      environment: process.env.NODE_ENV || "development",
    }
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
