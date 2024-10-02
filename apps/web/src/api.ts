import { Api } from "@2pm/api/client";
const api = new Api({
  baseUrl: process.env.API_BASE_URL,
  baseApiParams: { cache: "force-cache" },
});
export default api;
