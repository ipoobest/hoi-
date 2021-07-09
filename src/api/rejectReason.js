import axios from "@/api/axios.js";

export const getRejectReasons = async (params = "") => {
  const response = await axios.get(`/reject-reasons${params}`);
  return response.data;
};

export const addRejectReasons = async req => {
  const response = await axios.post("/reject-reasons", req);
  return response.data;
};

export const countRejectReasons = async () => {
  const response = await axios.get(`/reject-reasons/count`);
  return response.data;
};

export const getRejectReasonsById = async id => {
  const response = await axios.get(`/reject-reasons/${id}`);
  return response.data;
};

export const updateRejectReasonsById = async (id, req) => {
  const response = await axios.put(`/reject-reasons/${id}`, req);
  return response.data;
};

export const removeRejectReasonsById = async id => {
  const response = await axios.delete(`/reject-reasons/${id}`);
  return response.data;
};
