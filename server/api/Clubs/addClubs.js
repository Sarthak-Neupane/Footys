import { clubModel } from "../../schema";


export default defineEventHandler(async (event) => {

  const body = await readBody(event)

  // body.forEach(async (e,i)=>{
  //   const clubFill = await clubModel.create(e)
  //   console.log(clubFill)
  // })


  return {
    api : 'clubs',
    body: body
  }
})
