import axios from "@/api/axios.js";

export const getCompanyBankAccounts = async (params = "") => {
  const response = await axios.get(`/company-bank-accounts${params}`);
  return response.data;
};

export const addCompanyBankAccounts = async req => {
  const response = await axios.post("/company-bank-accounts", req);
  return response.data;
};

export const countCompanyBankAccounts = async () => {
  const response = await axios.get(`/company-bank-accounts/count`);
  return response.data;
};

export const getCompanyBankAccountsById = async id => {
  const response = await axios.get(`/company-bank-accounts/${id}`);
  return response.data;
};

export const updateCompanyBankAccountsById = async (id, req) => {
  const response = await axios.put(`/company-bank-accounts/${id}`, req);
  return response.data;
};

export const removeCompanyBankAccountsById = async id => {
  const response = await axios.delete(`/company-bank-accounts/${id}`);
  return response.data;
};
