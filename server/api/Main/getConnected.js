export default defineEventHandler(async (query)=>{
    const body = getQuery(query);
    const value = body.id

    return {
        api: 'Game',
        data: value
    }
});
