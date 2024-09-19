import ky from "ky";

export const api = ky.extend({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  mode: "cors",
});
