import { gameModel } from '~/server/schema/index.js'

let data
let columnClubs = []
let rowClubs = []
let matches = []
let gridAnswers = []
let occupiedIndexes = []
let result;

const getData = async getId => {
  console.log('getting data')
  data = await gameModel
    .findOne({
      id: getId
    })
    .exec()
  columnClubs = data.gameData.columnClubs
  rowClubs = data.gameData.rowClubs
  matches = data.gameData.matches
  gridAnswers = [
    matches[0][0],
    matches[0][1],
    matches[0][2],
    matches[1][0],
    matches[1][1],
    matches[1][2],
    matches[2][0],
    matches[2][1],
    matches[2][2]
  ]
}

const checkAnswer = async data => {
  outerloop: for (let [ind, elem] of gridAnswers.entries()) {
    if (occupiedIndexes.includes(ind)) continue
    for (let e of elem) {
      if (e.id === data.answer.id) {
        occupiedIndexes.push(ind)
        result = { correct: true, index: ind, answer: e, occupiedIndexes: occupiedIndexes, player: data.player, socket: data.socket }
        break outerloop
      } else {
        result = { correct: false, occupiedIndexes: occupiedIndexes, player: data.player, socket: data.socket }
      }
    }
  }
}

export default defineEventHandler(async event => {

  const body = await readBody(event)

  // const getId = event.context.params.id

  const getId = '9735d45673654baba5e336bb6ee4dfb0'

  if (!data) {
    await getData(getId)
    if (body.action === 'checkAnswer') {
      checkAnswer(body.meta)
    }
  } else {
    if (body.action === 'checkAnswer') {
      checkAnswer(body.meta)
    }
  }

  return {
    result: result,
  }
})
