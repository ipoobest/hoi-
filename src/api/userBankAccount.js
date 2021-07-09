import axios from "@/api/axios.js";
import store from "@/store";
import lodash from "lodash";

export const getUserBankAccounts = async (
  startRow = 0,
  endRow = 100,
  sortModel = [],
  filterModel = [],
  req
) => {
  let sortParams = "";
  if (sortModel.length) {
    sortParams += `&_sort=${
      sortModel[0].colId
    }:${sortModel[0].sort.toUpperCase()}`;
  }

  let filterParams = "";
  if (Object.keys(filterModel).length > 0) {
    filterParams = "";
    lodash.forOwn(filterModel, (value, key) => {
      let condition = "eq";
      const values = value.filter.split(",");
      if (value.type === "lessThanOrEquals") {
        condition = "lte";
      } else if (value.type === "lessThan") {
        condition = "lt";
      } else if (value.type === "greaterThanOrEquals") {
        condition = "gte";
      } else if (value.type === "greaterThan") {
        condition = "gt";
      } else if (value.type === "contains") {
        condition = "contains";
      }

      if (values.length > 1) {
        condition = "in";
        lodash.forEach(values, v => {
          filterParams += `&${key}_${condition}=${v}`;
        });
      } else {
        filterParams += `&${key}_${condition}=${value.filter}`;
      }
    });
  }

  if (!req) {
    req = "";
  }

  const response = await axios.get(
    `/user-bank-accounts?_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const addUserBankAccount = async bank => {
  const response = await axios.post("/user-bank-accounts", bank);
  return response.data;
};

export const countUserBankAccounts = async () => {
  const response = await axios.get(`/user-bank-accounts/count`);
  return response.data;
};

export const getUserBankAccountsById = async id => {
  const response = await axios.get(`/user-bank-accounts/${id}`);
  return response.data;
};

export const updateUserBankAccountsById = async (id, req) => {
  const response = await axios.put(`/user-bank-accounts/${id}`, req);
  return response.data;
};

export const removeUserBankAccount = async bank => {
  const response = await axios.delete("/user-bank-accounts/" + bank._id);
  return response.data;
};
