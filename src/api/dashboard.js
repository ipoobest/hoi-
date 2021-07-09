import axios from "@/api/axios.js";

export const getDashboard = async previousDays => {
  const response = await axios.get(
    `/custom/other/dashboard?previousDays=${previousDays}`
  );
  return response.data;
};
