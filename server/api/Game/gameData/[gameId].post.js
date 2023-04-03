import { getFirestore, setDoc, doc } from 'firebase/firestore'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const nitroapp = useNitroApp()
  const firebase = nitroapp.h3App.options.firebase

  const db = getFirestore(firebase)
  const docRef = doc(db, 'rooms', body.gameId)

  try {
    await setDoc(docRef, {
      gameId: body.gameId,
      socketIds: body.socketIds,
      playerIds: body.playerIds,
      gameData: body.gameData
    })
  } catch (e) {
    console.error('Error adding document: ', e)
  }

  return {
    body: {}
  }
})
