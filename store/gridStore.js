import { defineStore } from 'pinia'

export const useGridStore = defineStore('grid', () => {
    const columnClubs = ref([])
    const rowClubs = ref([])
    const matches = ref([])
    const gridAnswers = ref([])

    const setColumnClubs = (clubs) => {
        columnClubs.value = clubs
    }

    const setRowClubs = (clubs) => {
        rowClubs.value = clubs
    }

    const setMatches = (match) => {
        matches.value = match
    }

    const setGridAnswers = () => {
        gridAnswers.value = [
            matches.value[0][0],
            matches.value[0][1],
            matches.value[0][2],
            matches.value[1][0],
            matches.value[1][1],
            matches.value[1][2],
            matches.value[2][0],
            matches.value[2][1],
            matches.value[2][2]
        ]
    }

    return {
        columnClubs,
        rowClubs,
        matches,
        gridAnswers,
        setColumnClubs,
        setRowClubs,
        setMatches,
        setGridAnswers
    }
})
