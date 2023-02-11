import mongoose from 'mongoose'

export default async (_nitroApp)=>{
    const config = useRuntimeConfig()
    try{
        await mongoose.connect(config.mongodbURI)
        console.log('connected to mongo db')
    } catch(e) {
        console.log(e)
    }
}