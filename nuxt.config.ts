// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
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
    FIREBASE_API_KEY: process.env.FIREBASE_CONFIG_APIKEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_CONFIG_AUTHDOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_CONFIG_PROJECTID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_CONFIG_STORAGEBUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_CONFIG_MESSAGINGSENDERID,
    FIREBASE_APP_ID: process.env.FIREBASE_CONFIG_APPID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_CONFIG_MEASUREMENTID,

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
