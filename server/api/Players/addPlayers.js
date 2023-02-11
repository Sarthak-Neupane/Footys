import { clubModel } from "../../schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  for (const data of body) {
    for (let i = 0; i < data.clubs.length; i++) {
      const check = await clubModel.findOne({ name: data.clubs[i] }).exec();
      if (check != null) {
        data.clubs[i] = check._id;
      } else {
        data.clubs[i] = "Removed"
      }
    }
  }

  return {
    api: "players",
    body: body,
  };
});
