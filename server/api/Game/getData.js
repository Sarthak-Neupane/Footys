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
      // console.log(`We did ${matches.length}`)
    } else {
      // console.log(' We loop again ')
    }
  }

  return {
    api: 'get clubs',
    initialClubs: initialClubs,
    matches: matches,
    secondaryClubs: secondaryClubs,
  }
})

// -------------------------------------------------------------------------------------------------------------------------//



// const columnClubs = [
//   {
//     _id: "63e5279042fd03399bdfe733",
//     id: 4,
//     name: "Newcastle",
//     fullName: "Newcastle United",
//     league: "Premier League",
//     country: "England",
//     squad: [],
//     __v: 0,
//   },
//   {
//     _id: "63e5279042fd03399bdfe73f",
//     id: 16,
//     name: "Leeds",
//     fullName: "Leeds United",
//     league: "Premier League",
//     country: "England",
//     squad: [],
//     __v: 0,
//   },
//   {
//     _id: "63e5279042fd03399bdfe737",
//     id: 8,
//     name: "Fulham",
//     fullName: "Fulham FC",
//     league: "Premier League",
//     country: "England",
//     squad: [],
//     __v: 0,
//   },
// ];
// const matches = [
//   [
//     [
//       {
//         _id: "63e6728539bcf168cdb0456a",
//         id: 456,
//         name: "Ivan Toney",
//         shirtNumber: 17,
//         position: "Centre-Forward",
//         currentClub: "63e5279042fd03399bdfe736",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe736",
//           "63e5279042fd03399bdfe733",
//         ],
//         __v: 0,
//       },
//     ],
//     [
//       {
//         _id: "63e67061a57e5e3208658468",
//         id: 295,
//         name: "Alex McCarthy",
//         shirtNumber: 1,
//         position: "Goalkeeper",
//         currentClub: "63e5279042fd03399bdfe743",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe743",
//           "63e5279042fd03399bdfe73b",
//           "63e5279042fd03399bdfe73f",
//           "63e5279042fd03399bdfe736",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e6728539bcf168cdb04557",
//         id: 437,
//         name: "Pontus Jansson",
//         shirtNumber: 18,
//         position: "Centre-Back",
//         currentClub: "63e5279042fd03399bdfe736",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe736",
//           "63e5279042fd03399bdfe73f",
//           "63e52868b969baef8ede499d",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e672ed6633ea3de73e5e88",
//         id: 467,
//         name: "Stuart Dallas",
//         shirtNumber: 15,
//         position: "Right-Back",
//         currentClub: "63e5279042fd03399bdfe73f",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe73f",
//           "63e5279042fd03399bdfe736",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e672ed6633ea3de73e5e8c",
//         id: 471,
//         name: "Adam Forshaw",
//         shirtNumber: 4,
//         position: "Central Midfield",
//         currentClub: "63e5279042fd03399bdfe73f",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe73f",
//           "63e5279042fd03399bdfe736",
//         ],
//         __v: 0,
//       },
//     ],
//     [
//       {
//         _id: "63e673f311bdd788d422cdcf",
//         id: 517,
//         name: "Ryan Fredericks",
//         shirtNumber: 2,
//         position: "Right-Back",
//         currentClub: "63e5279042fd03399bdfe742",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe742",
//           "63e5279042fd03399bdfe740",
//           "63e5279042fd03399bdfe737",
//           "63e5279042fd03399bdfe734",
//           "63e5279042fd03399bdfe736",
//         ],
//         __v: 0,
//       },
//     ],
//   ],
//   [
//     [
//       {
//         _id: "63e66d36a1934494aacabf86",
//         id: 172,
//         name: "Jamaal Lascelles",
//         shirtNumber: 6,
//         position: "Centre-Back",
//         currentClub: "63e5279042fd03399bdfe733",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe733",
//           "63e5279042fd03399bdfe73c",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e6716957c170b9969f4fc0",
//         id: 366,
//         name: "Jack Colback",
//         shirtNumber: 8,
//         position: "Defensive Midfield",
//         currentClub: "63e5279042fd03399bdfe73c",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe73c",
//           "63e5279042fd03399bdfe733",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e6716957c170b9969f4fc5",
//         id: 371,
//         name: "Jonjo Shelvey",
//         shirtNumber: 6,
//         position: "Central Midfield",
//         currentClub: "63e5279042fd03399bdfe73c",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe73c",
//           "63e5279042fd03399bdfe733",
//           "63e5279042fd03399bdfe739",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e6716957c170b9969f4fd0",
//         id: 382,
//         name: "Chris Wood",
//         shirtNumber: 39,
//         position: "Centre-Forward",
//         currentClub: "63e5279042fd03399bdfe733",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe733",
//           "63e5279042fd03399bdfe73c",
//           "63e5279042fd03399bdfe73f",
//           "63e5279042fd03399bdfe73d",
//           "63e5279042fd03399bdfe735",
//         ],
//         __v: 0,
//       },
//     ],
//     [
//       {
//         _id: "63e6716957c170b9969f4fd0",
//         id: 382,
//         name: "Chris Wood",
//         shirtNumber: 39,
//         position: "Centre-Forward",
//         currentClub: "63e5279042fd03399bdfe733",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe733",
//           "63e5279042fd03399bdfe73c",
//           "63e5279042fd03399bdfe73f",
//           "63e5279042fd03399bdfe73d",
//           "63e5279042fd03399bdfe735",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e672ed6633ea3de73e5e95",
//         id: 480,
//         name: "Patrick Bamford",
//         shirtNumber: 9,
//         position: "Centre-Forward",
//         currentClub: "63e5279042fd03399bdfe73f",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe73f",
//           "63e5279042fd03399bdfe738",
//           "63e5279042fd03399bdfe73b",
//           "63e5279042fd03399bdfe73c",
//         ],
//         __v: 0,
//       },
//     ],
//     [
//       {
//         _id: "63e6716957c170b9969f4fbb",
//         id: 361,
//         name: "Neco Williams",
//         shirtNumber: 7,
//         position: "Right-Back",
//         currentClub: "63e5279042fd03399bdfe73c",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe73c",
//           "63e5279042fd03399bdfe739",
//           "63e5279042fd03399bdfe737",
//         ],
//         __v: 0,
//       },
//     ],
//   ],
//   [
//     [
//       {
//         _id: "63e66d36a1934494aacabf95",
//         id: 187,
//         name: "Anthony Gordon",
//         shirtNumber: 8,
//         position: "Left Winger",
//         currentClub: "63e5279042fd03399bdfe733",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe733",
//           "63e5279042fd03399bdfe741",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e670d9160b3d5932b7a1c1",
//         id: 345,
//         name: "Andros Townsend",
//         shirtNumber: 14,
//         position: "Right Winger",
//         currentClub: "63e5279042fd03399bdfe741",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe741",
//           "63e5279042fd03399bdfe73b",
//           "63e5279042fd03399bdfe733",
//           "63e5279042fd03399bdfe734",
//           "63e5279042fd03399bdfe73f",
//         ],
//         __v: 0,
//       },
//     ],
//     [
//       {
//         _id: "63e670d9160b3d5932b7a1ae",
//         id: 326,
//         name: "Andy Lonergan",
//         shirtNumber: 31,
//         position: "Goalkeeper",
//         currentClub: "63e5279042fd03399bdfe741",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe741",
//           "63e5279042fd03399bdfe739",
//           "63e5279042fd03399bdfe73f",
//           "63e5279042fd03399bdfe73e",
//           "63e5279042fd03399bdfe737",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e670d9160b3d5932b7a1c1",
//         id: 345,
//         name: "Andros Townsend",
//         shirtNumber: 14,
//         position: "Right Winger",
//         currentClub: "63e5279042fd03399bdfe741",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe741",
//           "63e5279042fd03399bdfe73b",
//           "63e5279042fd03399bdfe733",
//           "63e5279042fd03399bdfe734",
//           "63e5279042fd03399bdfe73f",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e672ed6633ea3de73e5e80",
//         id: 459,
//         name: "Joel Robles",
//         shirtNumber: 22,
//         position: "Goalkeeper",
//         currentClub: "63e5279042fd03399bdfe73f",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe73f",
//           "63e5281d15e7e9fb79c84945",
//           "63e5279042fd03399bdfe741",
//           "63e5281d15e7e9fb79c84942",
//           "63e5281d15e7e9fb79c84943",
//         ],
//         __v: 0,
//       },
//     ],
//     [
//       {
//         _id: "63e670d9160b3d5932b7a1ae",
//         id: 326,
//         name: "Andy Lonergan",
//         shirtNumber: 31,
//         position: "Goalkeeper",
//         currentClub: "63e5279042fd03399bdfe741",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe741",
//           "63e5279042fd03399bdfe739",
//           "63e5279042fd03399bdfe73f",
//           "63e5279042fd03399bdfe73e",
//           "63e5279042fd03399bdfe737",
//         ],
//         __v: 0,
//       },
//       {
//         _id: "63e67374c6167f52d4f9eec2",
//         id: 485,
//         name: "Shane Duffy",
//         shirtNumber: 5,
//         position: "Centre-Back",
//         currentClub: "63e5279042fd03399bdfe737",
//         clubsPlayedFor: [
//           "63e5279042fd03399bdfe737",
//           "63e5279042fd03399bdfe735",
//           "63e5279042fd03399bdfe741",
//         ],
//         __v: 0,
//       },
//     ],
//   ],
// ];
// const rowClubs = [
//   {
//     _id: "63e5279042fd03399bdfe736",
//     id: 7,
//     name: "Brentford",
//     fullName: "Brentford FC",
//     league: "Premier League",
//     country: "England",
//     squad: [],
//     __v: 0,
//   },
//   {
//     _id: "63e5279042fd03399bdfe73c",
//     id: 13,
//     name: "Nottm Forest",
//     fullName: "Nottingham Forest",
//     league: "Premier League",
//     country: "England",
//     squad: [],
//     __v: 0,
//   },
//   {
//     _id: "63e5279042fd03399bdfe741",
//     id: 18,
//     name: "Everton",
//     fullName: "Everton FC",
//     league: "Premier League",
//     country: "England",
//     squad: [],
//     __v: 0,
//   },
// ];


// export default defineEventHandler(async () => {
  
//   return {
//     api: 'get clubs',
//     initialClubs: rowClubs,
//     matches: matches,
//     secondaryClubs: columnClubs,
//   }

// })




