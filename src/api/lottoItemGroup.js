import axios from "@/api/axios.js";
import lodash from "lodash";

export const getLottoItemGroupsTable = async (
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
    `/lotto-item-groups?_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getSumLottoItemGroups = async (filterModel, req) => {
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
    `/lotto-item-groups/sum?1=1` + req + filterParams
  );
  return response.data;
};

export const getLottoItemGroupsByTypes = (params = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `/lotto-item-groups/findbytypes` + params
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getLottoItemGroupsByNumbers = (params = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `/lotto-item-groups/findbynumbers` + params
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
