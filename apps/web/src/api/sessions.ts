import { FindSessionsQueryDto } from "@2pm/data";
import api from ".";

const { getSessions } = api.sessions;

const getSession = async (
  id: NonNullable<FindSessionsQueryDto["ids"]>[number],
) => {
  const res = await getSessions({ ids: [id], limit: 1 });
  return res.data.length === 1 ? res.data[0] : null;
};

export { getSession };
