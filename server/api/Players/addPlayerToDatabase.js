import { playerModel } from "../../schema";

export default defineEventHandler(async (event) => {
  let body = await readBody(event);

  const contains = await playerModel
    .findOne({
      id: body[0].id,
    })
    .exec();

  if (contains != null) {
    body = "Already Exists";
  } else {
    body.forEach(async (e, i) => {
      const playerFill = await playerModel.create(e);
      console.log(playerFill);
    });
  }

  return {
    api: "players",
    body: body,
  };
});
