import axios from "@/api/axios.js";

export const getAffiliateConfigs = async () => {
  const response = await axios.get("/affiliate-configs");
  return response.data;
};

export const saveAffiliateConfigs = async data => {
  const response = await axios.post("/affiliate-configs/all", data);
  return response.data;
};
