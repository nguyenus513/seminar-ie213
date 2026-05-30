import axiosClient from "./axiosClient";

export const seedApi = {
  status: () => axiosClient.get("/seed/status"),
  seed: (body) => axiosClient.post("/seed", body),
  clear: () => axiosClient.delete("/seed")
};
