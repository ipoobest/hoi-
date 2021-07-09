import axios from "@/api/axios.js";
import lodash from "lodash";

export const sendSMSSingle = async data => {
  const response = await axios.post("/custom/users/phone/sms/single", data);
  return response.data;
};

export const sendSMSMany = async data => {
  const response = await axios.post("/custom/users/phone/sms/many", data);
  return response.data;
};

export const sendSMSBroadcast = async data => {
  const response = await axios.post("/custom/users/phone/sms/broadcast", data);
  return response.data;
};

export const getSMSInfo = async () => {
  const response = await axios.get("/custom/users/phone/sms/info");
  return response.data;
};

export const updateAutoSMSText = async data => {
  const response = await axios.patch("/custom/users/phone/sms/auto-sms", data);
  return response.data;
};

export const updateInitAutoSMSText = async () => {
  const response = await axios.patch("/custom/users/phone/sms/init-auto-sms", {});
  return response.data;
};

export const getAutoSMSText = async () => {
  const response = await axios.get("/custom/users/phone/sms/auto-sms");
  return response.data;
};

export const getSMSReport = async (
  startRow,
  endRow,
  sortModel,
  filterModel,
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

      if (key === "createdAt" || key === "resultedAt") {
        filterParams += `&${key}_gte=${encodeURIComponent(
          values[0]
        )}&${key}_lte=${encodeURIComponent(values[1])}`;
      } else {
        if (values.length > 1) {
          condition = "in";
          lodash.forEach(values, v => {
            filterParams += `&${key}_${condition}=${encodeURIComponent(v)}`;
          });
        } else {
          filterParams += `&${key}_${condition}=${encodeURIComponent(
            value.filter
          )}`;
        }
      }
    });
  }

  if (!req) {
    req = "";
  }

  const response = await axios.get(
    `/sms-reports?_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getSMSTransactions = async (
  startRow,
  endRow,
  sortModel,
  filterModel,
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

      if (key === "createdAt" || key === "resultedAt") {
        filterParams += `&${key}_gte=${encodeURIComponent(
          values[0]
        )}&${key}_lte=${encodeURIComponent(values[1])}`;
      } else {
        if (values.length > 1) {
          condition = "in";
          lodash.forEach(values, v => {
            filterParams += `&${key}_${condition}=${encodeURIComponent(v)}`;
          });
        } else {
          filterParams += `&${key}_${condition}=${encodeURIComponent(
            value.filter
          )}`;
        }
      }
    });
  }

  if (!req) {
    req = "";
  }

  const response = await axios.get(
    `/sms-transactions?_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getSumSMSTransactions = async (
  filterModel,
  req
) => {
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

      if (key === "createdAt") {
        filterParams += `&${key}_gte=${encodeURIComponent(
          values[0]
        )}&${key}_lte=${encodeURIComponent(values[1])}`;
      } else {
        if (values.length > 1) {
          condition = "in";
          lodash.forEach(values, v => {
            filterParams += `&${key}_${condition}=${encodeURIComponent(v)}`;
          });
        } else {
          filterParams += `&${key}_${condition}=${encodeURIComponent(
            value.filter
          )}`;
        }
      }
    });
  }

  if (!req) {
    req = "";
  }

  const response = await axios.get(
    `/sms-transactions/sum?` +
      req +
      filterParams
  );
  return response.data;
};

export const getSMSTransactionsCount = async () => {
  const response = await axios.get("/sms-transactions/count");
  return response.data;
};

export const getSMSTransactionById = async id => {
  const response = await axios.get("/sms-transactions/" + id);
  return response.data;
};

export const createSMSTransaction = async data => {
  const response = await axios.post("/sms-transactions", data);
  return response.data;
};

export const updateSMSTransactionById = async (id, data) => {
  const response = await axios.put("/sms-transactions/" + id, data);
  return response.data;
};

export const deleteSMSTransactionById = async id => {
  const response = await axios.delete("/sms-transactions/" + id);
  return response.data;
};