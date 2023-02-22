import { playerModel, clubModel } from '../../schema'

const randomNumber = (min, max, exclude) => {
  const number = Math.floor(Math.random() * (max - min + 1)) + min
  if (!exclude.includes(number)) {
    return number
  } else {
    return randomNumber(min, max, exclude)
  }
}

const difficultFindMatch = async (currentClubId, clubsPlayedForId) => {
  const player = await playerModel
    .find({
      clubsPlayedFor: { $all: [clubsPlayedForId, currentClubId] }
    })
    .exec()

  return player
}

const getRowClub = async (min, max, exclude) => {
  const club = await clubModel
    .findOne({
      id: randomNumber(min, max, exclude)
    })
    .exec()

  return club
}
const initiateFirstRow = async (clubToCheckFor, initialClubs) => {
  const players = []
  for (let e of initialClubs) {
    let match = await difficultFindMatch(clubToCheckFor._id, e._id)
    if (!match.length > 0) {
      break
    } else {
      players.push(match)
    }
  }
  if (players.length === 3) {
    return players
  } else {
    console.log('Did not satisfy')
    return []
  }
}

export default defineEventHandler(async () => {
  const min = 1
  const max = 20
  const column = []
  const initialClubs = []
  const exclude = []
  const secondaryClubs = []
  const matches = []

  while (column.length < 3) {
    let randomNum = randomNumber(min, max, [])
    if (!column.includes(randomNum)) {
      column.push(randomNum)
      exclude.push(randomNum)
    }
  }

  for (let i = 0; i < 3; i++) {
    const clubs = await clubModel.findOne({ id: column[i] }).exec()
    initialClubs.push(clubs)
  }

  while (matches.length < 3) {
    let club = await getRowClub(min, max, exclude)
    exclude.push(club.id)

    let matchedPlayersArray = await initiateFirstRow(club, initialClubs)

    if (matchedPlayersArray.length === 3) {
      secondaryClubs.push(club)
      matches.push(matchedPlayersArray)
      console.log(`We did ${matches.length}`)
    } else {
      console.log(' We loop again ')
    }
  }

  return {
    api: 'get clubs',
    initialClubs: initialClubs,
    matches: matches,
    secondaryClubs: secondaryClubs,
  }
})
