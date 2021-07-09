import axios from "@/api/axios.js";

export const getProducts = async (params = "") => {
  const response = await axios.get(`/products${params}`);
  return response.data;
};

export const addProduct = async req => {
  const response = await axios.post("/products", req);
  return response.data;
};

export const countProducts = async () => {
  const response = await axios.get(`/products/count`);
  return response.data;
};

export const getProductById = async id => {
  const response = await axios.get(`/products/${id}`);
  return response.data;
};

export const updateProductById = async (id, req) => {
  const response = await axios.put(`/products/${id}`, req);
  return response.data;
};

export const removeProductById = async id => {
  const response = await axios.delete(`/products/${id}`);
  return response.data;
};

export const getProductTable = async (
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
      }

      if (key === "user") {
        key = "user.username";
      } else if (key === "phone") {
        key = "user.phone";
      } else if (key === "email") {
        key = "user.email";
      } else if (key === "parentUsername") {
        key = "user.parentUsername";
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
    `/products?_start=${startRow}&_limit=${endRow - startRow}${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getSumProducts = async (filterModel, req) => {
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
      }

      if (key === "user") {
        key = "user.username";
      } else if (key === "phone") {
        key = "user.phone";
      } else if (key === "email") {
        key = "user.email";
      } else if (key === "parentUsername") {
        key = "user.parentUsername";
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

  const response = await axios.get(`/products/sum?1=1` + req + filterParams);
  return response.data;
};
