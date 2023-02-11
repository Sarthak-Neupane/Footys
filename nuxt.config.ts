// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',

  ],

  nitro: {
    plugins: ['~/server/index.js']
  },

  runtimeConfig: {
    mongodbURI: process.env.MONGODB_URI
  }
})
