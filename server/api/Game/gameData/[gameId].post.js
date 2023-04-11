import { gameModel } from '~/server/schema/index.js'

let data
let columnClubs = []
let rowClubs = []
let matches = []
let gridAnswers = []
let occupiedIndexes = []
let occupiedIndexesDetails = []
let result

const getDataNumbersFromIndexNumber = (indexNumber) => {
  switch (indexNumber) {
      case 0:
          return 8;
      case 1:
          return 3;
      case 2:
          return 4;
      case 3:
          return 1;
      case 4:
          return 5;
      case 5:
          return 9;
      case 6:
          return 6;
      case 7:
          return 7;
      case 8:
          return 2;
      default:
          return null;
  }
}

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
      if (e.id === data.answer?.id) {
        occupiedIndexes.push(ind)
        occupiedIndexesDetails.push({
          index: ind,
          gridNumber: getDataNumbersFromIndexNumber(ind),
          player: data.player,
          socketId: data.socket
        })
        result = { correct: true, index: ind, occupiedIndexes: occupiedIndexes }
        break outerloop
      } else {
        result = {
          correct: false,
          index: null,
          occupiedIndexes: occupiedIndexes
        }
      }
    }
  }
}

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const getId = event.context.params.gameId

  console.log(getId)

  if (!data) {
    await getData(getId)
    if (body.action === 'checkAnswer') {
      checkAnswer(body.meta)
    }
    if(body.action === 'emptyCheck'){
      result = { correct: false, index: null, occupiedIndexes: occupiedIndexes }
    }
  } else {
    if (body.action === 'checkAnswer') {
      checkAnswer(body.meta)
    }
    if(body.action === 'emptyCheck'){
      result = { correct: false, index: null, occupiedIndexes: occupiedIndexes }
    }
  }

  return {
    result: result,
    meta: {
      answer: body.meta.answer,
      player: body.meta.player,
      socketId: body.meta.socket
    },
    occupiedIndexesDetails: occupiedIndexesDetails
  }
})
