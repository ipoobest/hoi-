import axios from "@/api/axios.js";

export const getWinLoss = async (req = "") => {
  const response = await axios.get(`/win-losses/group${req}`);
  return response.data;
};
