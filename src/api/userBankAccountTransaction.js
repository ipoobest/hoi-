import axios from "@/api/axios.js";

export const getUserBankAccountTransaction = async (params = "") => {
  const response = await axios.get(`/user-bank-account-transactions${params}`);
  return response.data;
};

export const addUserBankAccountTransactions = async req => {
  const response = await axios.post("/user-bank-account-transactions", req);
  return response.data;
};

export const countUserBankAccountTransaction = async () => {
  const response = await axios.get(`/user-bank-account-transactions/count`);
  return response.data;
};

export const getUserBankAccountTransactionById = async id => {
  const response = await axios.get(`/user-bank-account-transactions/${id}`);
  return response.data;
};

export const updateUserBankAccountTransactionById = async (id, req) => {
  const response = await axios.put(
    `/user-bank-account-transactions/${id}`,
    req
  );
  return response.data;
};

export const removeUserBankAccountTransactionById = async id => {
  const response = await axios.delete(`/user-bank-account-transactions/${id}`);
  return response.data;
};
