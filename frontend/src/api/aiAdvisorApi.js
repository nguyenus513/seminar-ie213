import axiosClient from "./axiosClient";

export const aiAdvisorApi = {
  analyze: (body) => axiosClient.post("/ai-advisor/analyze", body),
  recommend: (body) => axiosClient.post("/ai-advisor/recommend-indexes", body),
  validate: (body) => axiosClient.post("/ai-advisor/validate", body),
  history: () => axiosClient.get("/ai-advisor/history")
};
