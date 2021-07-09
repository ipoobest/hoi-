import axios from "@/api/axios.js";

export const getLottoLimitNumbers = async (params = "") => {
  const response = await axios.get(`/lotto-limit-numbers${params}`);
  return response.data;
};

export const addLottoLimitNumber = async data => {
  const response = await axios.post(`/lotto-limit-numbers`, data);
  return response.data;
};

export const deleteLottoLimitNumber = async id => {
  const response = await axios.delete(`/lotto-limit-numbers/${id}`);
  return response.data;
};
