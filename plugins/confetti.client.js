import JSConfetti from 'js-confetti'

export default defineNuxtPlugin(NuxtApp => {
    const confetti = new JSConfetti()
    return {
        provide: {
            confetti: confetti
        }
    }
})
