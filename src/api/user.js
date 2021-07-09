import axios from "@/api/axios.js";
import store from "@/store";
import lodash from "lodash";

export const getUser = async () => {
  const response = await axios.get("/users/me");
  return response.data;
};

export const getUsers = async (params = "") => {
  const response = await axios.get(`/users${params}`);
  return response.data;
};

export const getGridUsers = async (
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
    `/users?type_null=false&_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  console.log("get user", response.data);
  return response.data;
};

export const getGridUsersLoginFail = async (
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
    `/user-login-fail-transactions?roleName_eq=Authenticated&_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getGridUsersLoginSuccess = async (
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
    `/user-login-transactions?roleName_eq=Authenticated&_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getUserById = async id => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

export const updateUserById = async (id, req) => {
  const response = await axios.put(`/users/${id}`, req);
  return response.data;
};

export const updateUser = async (req, oldPassword) => {
  const user = store.get("auth/me");

  if (req.password) {
    const response = await axios.post(
      "/auth/local",
      {
        identifier: user.username,
        password: oldPassword
      },
      {
        headers: { Authorization: "" }
      }
    );
    localStorage.setItem("jwt", response.data.jwt);
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + response.data.jwt;
    store.set("auth/me", response.data.user);
  }

  const response = await axios.put("/users/" + user._id, req);
  return response.data;
};

export const getGridAdmins = async (
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
    });
  }

  if (!req) {
    req = "";
  }

  const response = await axios.get(
    `/custom/users/admin?_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getGridAdminsLoginFail = async (
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
    `/user-login-fail-transactions?_start=${startRow}&_limit=${
      endRow - startRow
    }${sortParams}` +
      req +
      filterParams
  );
  return response.data;
};

export const getSumUsers = async (filterModel, req) => {
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
    `/custom/users/sum?1=1` + req + filterParams
  );
  return response.data;
};

export const userForceChangePassword = async req => {
  const response = await axios.put("/custom/users/forcepassword", req);
  return response.data;
};
