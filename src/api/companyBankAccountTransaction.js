import axios from "@/api/axios.js";

export const getCompanyBankAccountTransaction = async (params = "") => {
  const response = await axios.get(
    `/company-bank-account-transactions${params}`
  );
  return response.data;
};

export const addCompanyBankAccountTransactions = async req => {
  const response = await axios.post("/company-bank-account-transactions", req);
  return response.data;
};

export const countCompanyBankAccountTransaction = async () => {
  const response = await axios.get(`/company-bank-account-transactions/count`);
  return response.data;
};

export const getCompanyBankAccountTransactionById = async id => {
  const response = await axios.get(`/company-bank-account-transactions/${id}`);
  return response.data;
};

export const updateCompanyBankAccountTransactionById = async (id, req) => {
  const response = await axios.put(
    `/company-bank-account-transactions/${id}`,
    req
  );
  return response.data;
};

export const removeCompanyBankAccountTransactionById = async id => {
  const response = await axios.delete(
    `/company-bank-account-transactions/${id}`
  );
  return response.data;
};
