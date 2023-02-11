// import { clubModel } from "../../schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  return {
    api: "clubs",
    query: query,
  };
});
