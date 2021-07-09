import axios from "@/api/axios.js";

export const createOrUpdateRisks = async data => {
  const response = await axios.post(
    "/product-lotto-risks/create-update-all",
    data
  );
  return response.data;
};
