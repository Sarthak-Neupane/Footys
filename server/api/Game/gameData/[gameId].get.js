import { getFirestore, getDoc, doc } from 'firebase/firestore'

let docData;

export default defineEventHandler(async event => {
  if (!docData) {
    const nitroapp = useNitroApp()
    const firebase = nitroapp.h3App.options.firebase

    const db = getFirestore(firebase)
    const docRef = doc(db, 'rooms', event.context.params.gameId)

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      docData = docSnap.data()
    } else {
      console.log('No such document!')
    }
  }

  return { body: docData }
})
