import axios from "@/api/axios.js";
import moment from "moment";
import lodash from "lodash";

export const getLottoById = lottoId => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/lottos/${lottoId}`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getYeekeeToday = async (
  filterDate,
  params = "",
  sortParams = "finished:ASC,round:ASC"
) => {
  // let now = await getSystemTime();
  let date = moment();
  if (filterDate) {
    date = moment(filterDate, "YYYY-MM-DD");
  }

  let startedAt = moment(date)
    .hours(4)
    .minutes(59)
    .seconds(59)
    .milliseconds(999);
  let endedAt = moment(date)
    .hours(3)
    .minutes(45)
    .seconds(0)
    .milliseconds(0)
    .add(1, "days");
  const response = await axios.get(
    `/lottos?_sort=${sortParams}&type=YEEKEE&startedAt_gte=${encodeURIComponent(
      startedAt.format()
    )}&endedAt_lte=${encodeURIComponent(endedAt.format())}${params}`
  );
  return response.data;
};

export const getLottoByProdcutIdAndDate = async (
  productLottoId,
  type,
  filterDate,
  limit
) => {
  let filterDateStr = "";
  if (filterDate) {
    const date = moment(filterDate, "YYYY-MM-DD");
    const startedAt = moment(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    const endedAt = moment(date)
      .hours(23)
      .minutes(59)
      .seconds(59)
      .milliseconds(999)
      .add(1, "days");
    filterDateStr = `&resultedAt_gte=${encodeURIComponent(
      startedAt.format()
    )}&resultedAt_lte=${encodeURIComponent(endedAt.format())}`;
  }
  let limitStr = "";
  if (limit) {
    limitStr = "&_limit=100";
  }
  const response = await axios.get(
    `/lottos?_sort=status:DESC,resultedAt:DESC&productLottoId_eq=${productLottoId}&type=${type}${filterDateStr}${limitStr}`
  );
  return response.data;
};

export const createLotto = async data => {
  const response = await axios.post("/custom/lottos", data);
  return response.data;
};

export const updateLottoById = async (id, data) => {
  const response = await axios.put("/lottos/" + id, data);
  return response.data;
};

export const updateLottoByProductId = async (id, data) => {
  const response = await axios.put("/lottos/product/" + id, data);
  return response.data;
};

export const lottoAward = async (id, data) => {
  const response = await axios.put("/custom/lottos/calcresult/" + id, data);
  return response.data;
};

export const calcYeekeeResultByLottoId = async id => {
  const response = await axios.put("/custom/lottos/calcyeekeeresult/" + id);
  return response.data;
};

export const calcLottoResultByLottoId = async (id, data) => {
  const response = await axios.put("/custom/lottos/calcresult/" + id, data);
  return response.data;
};

export const getLottoTable = async (
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
    `/lottos?_start=${startRow}&_limit=${endRow - startRow}${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getSumLottos = async (filterModel, req) => {
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

  const response = await axios.get(`/lottos/sum?1=1` + req + filterParams);
  return response.data;
};

export const deleteLotto = async (id, isRefund) => {
  let refund = "false";
  if (isRefund) {
    refund = "true";
  }
  const response = await axios.delete(
    "/custom/lottos/" + id + "?refund=" + refund
  );
  return response.data;
};

export const rollbackLotto = async id => {
  const response = await axios.post(
    "/custom/lottos/rollback/" + id,
    {},
    {
      timeout: 1800000 // 30 mins
    }
  );
  return response.data;
};
