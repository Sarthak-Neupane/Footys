import { playerModel } from "../../schema";

export default defineEventHandler(async (query)=>{
    const body = getQuery(query);
    const value = body.value

    // console.log('into the server')
    const players = await playerModel.find({name : {$regex: value, $options: 'i'}}).limit(6).exec();
    return {
        api: 'Game',
        body: value,
        players: players
    }
});
