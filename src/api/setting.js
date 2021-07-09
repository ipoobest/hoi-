import axios from "@/api/axios.js";

export const getSetting = async () => {
  const response = await axios.get("/settings?key=Company");
  return response.data[0];
};

export const saveSetting = async (id, data) => {
  const response = await axios.put("/settings/" + id, data);
  return response.data;
};
