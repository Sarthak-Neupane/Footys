import { playerModel } from "../../schema";

export default defineEventHandler(async () => {
  const body = await playerModel
    .find()
    .populate({path: "currentClub"})
    .populate({path: "clubsPlayedFor"});

    console.log(body)

  return {
    api: "players",
    body: body,
  };
});
