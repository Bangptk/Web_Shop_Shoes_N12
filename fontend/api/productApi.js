import axiosClient from "./axiosClient";
const productApi = {
  getAll: () => axiosClient.get("/products"),
  getDetail: (id) => axiosClient.get(`/products/${id}`),
};
export default productApi;