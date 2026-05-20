import axiosClient from "./axiosClient";

export const indexApi = {
  strategies: () => axiosClient.get("/indexes/strategies"),
  list: () => axiosClient.get("/indexes"),
  create: (strategyKey) => axiosClient.post("/indexes/create", { strategyKey }),
  drop: (collection, indexName) => axiosClient.delete("/indexes/drop", { data: { collection, indexName } }),
  dropAll: () => axiosClient.delete("/indexes/drop-all-custom")
};
