import axios from "@/api/axios.js";

export const getBanks = async (params = "") => {
  const response = await axios.get(`/banks${params}`);
  return response.data;
};

export const addBanks = async req => {
  const response = await axios.post("/banks", req);
  return response.data;
};

export const countBanks = async () => {
  const response = await axios.get(`/banks/count`);
  return response.data;
};

export const getBanksById = async id => {
  const response = await axios.get(`/banks/${id}`);
  return response.data;
};

export const updateBanksById = async (id, req) => {
  const response = await axios.put(`/banks/${id}`, req);
  return response.data;
};

export const removeBanksById = async id => {
  const response = await axios.delete(`/banks/${id}`);
  return response.data;
};
