import axiosClient from "./axiosClient";

export const benchmarkApi = {
  queries: () => axiosClient.get("/benchmark/queries"),
  runOne: (body) => axiosClient.post("/benchmark/run-one", body),
  runAll: (body) => axiosClient.post("/benchmark/run-all", body),
  matrixQueries: () => axiosClient.get("/benchmark/matrix-queries"),
  runMatrix: (body) => axiosClient.post("/benchmark/run-matrix", body),
  matrixHistory: (params) => axiosClient.get("/benchmark/matrix-history", { params }),
  history: () => axiosClient.get("/benchmark/history"),
  compare: () => axiosClient.get("/benchmark/compare"),
  explain: (queryKey) => axiosClient.get(`/explain/${queryKey}`)
};
