import { gameModel } from "~/server/schema/index.js";

export default defineEventHandler(async (event) => {

  const body = await readBody(event)

  const gameData  = await gameModel.create({
    id: body.gameId,
    playerIds: body.playerIds,
    socketIds: body.socketIds,
    gameData: body.gameData,
  })

  return {
    api : 'clubs',
    body: gameData
  }
})
