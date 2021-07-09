import axios from "@/api/axios.js";

export const getProducts = async (params = "") => {
  const response = await axios.get(`/product-lottos${params}`);
  return response.data;
};

export const getProductLottoYeekee = async () => {
  const response = await axios.get(
    "/product-lottos?type_eq=LOTTO&status_eq=OPEN&type_eq=YEEKEE&_sort=order:ASC,createdAt:ASC"
  );
  return response.data;
};

export const getProductStock = async () => {
  const response = await axios.get(
    "/product-lottos?type_eq=STOCK&status_eq=OPEN&_sort=order:ASC"
  );
  return response.data;
};

export const getProductSet = async () => {
  const response = await axios.get(
    "/product-lottos?type_eq=SET&_sort=order:ASC"
  );
  return response.data;
};

export const getProductById = async id => {
  const response = await axios.get("/product-lottos/" + id);
  return response.data;
};

export const getAvailableLotto = async (params = "") => {
  const response = await axios.get(
    "/custom/product-lottos/admin/lottos" + params
  );
  return response.data;
};

export const updateProductLottoById = async (id, data) => {
  const response = await axios.put("/product-lottos/" + id, data);
  return response.data;
};

export const updateProductLottoActiveById = async data => {
  const response = await axios.put("/product-lottos/update/active", data);
  return response.data;
};

export const createProductLotto = async data => {
  const response = await axios.post(`/product-lottos`, data);
  return response.data;
};

export const deleteProductLotto = async (id, isRefund) => {
  let refund = "false";
  if (isRefund) {
    refund = "true";
  }
  const response = await axios.delete(
    "/custom/product-lottos/" + id + "?refund=" + refund
  );
  return response.data;
};

export const getProductLottoTable = async (
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
    `/product-lottos?_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getSumProductLottos = async (filterModel, req) => {
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
    `/product-lottos/sum?1=1` + req + filterParams
  );
  return response.data;
};

export const getOverall = (params = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/product-lottos/overall` + params);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
