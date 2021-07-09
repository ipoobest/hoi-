import axios from "@/api/axios.js";

export const getSimulate = async (lottoId, flag) => {
  const response = await axios.post("/custom/yeekee-tables/simulate", {
    lottoId: lottoId,
    calc: flag
  });
  return response.data;
};

export const getYeeKeeTable = (
  lottoId,
  startRow,
  endRow,
  sortModel,
  filterModel
) => {
  let sortParams = "";
  if (sortModel.length) {
    sortParams += `&_sort=${
      sortModel[0].colId
    }:${sortModel[0].sort.toUpperCase()}`;
  }

  let filterParams = "";
  Object.keys(filterModel).forEach(item => {
    const { filter, filterTo } = filterModel[item];
    if (filterTo) {
      filterParams += `&${item}_gte=${filter}&${item}_lte=${filterTo}`;
    } else {
      filterParams += `&${item}_eq=${filter}`;
    }
  });

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `/custom/yeekee-tables?_start=${startRow}&_limit=${
          endRow - startRow
        }${sortParams}${filterParams}&lottoId_eq=${lottoId}`
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
