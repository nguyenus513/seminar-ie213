import axiosClient from "./axiosClient";

export const shopApi = {
  products: (params) => axiosClient.get("/shop/products", { params }),
  product: (id) => axiosClient.get(`/shop/products/${id}`),
  compare: (body) => axiosClient.post("/shop/search/compare", body)
};
