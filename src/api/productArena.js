import axios from "@/api/axios.js"

export const getProductArenas = async (params = "") => {
  const response = await axios.get(`/product-arenas${params}`);
  return response.data;
};

export const getProductArenaCount = async () => {
  const response = await axios.get("/product-arenas/count");
  return response.data;
};

export const getProductArenaReport = async () => {
  const response = await axios.get("/product-arenas/report");
  return response.data;
};

export const getProductArenaById = async id => {
  const response = await axios.get("/product-arenas/" + id);
  return response.data;
};

export const updateProductArenaById = async (id, data) => {
  const response = await axios.put("/product-arenas/" + id, data);
  return response.data;
};

export const updateProductArenaActiveById = async data => {
  const response = await axios.put("/product-arenas/update/active", data);
  return response.data;
};