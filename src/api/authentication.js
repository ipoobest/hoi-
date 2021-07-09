import axios from "@/api/axios.js";
import store from "@/store";

export const authLocalLogin = (identifier, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post("/auth/local", {
        identifier,
        password
      });

      const { jwt, user } = response.data;

      if (user.role.name !== "Authenticated") {
        localStorage.setItem("jwt", jwt);
        axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
        store.set("auth/me", user);
      } else {
        throw new Error();
      }

      resolve(response.data);
    } catch (error) {
      delete axios.defaults.headers.common["Authorization"];
      store.set("auth/me", {});
      localStorage.removeItem("token");

      reject(error);
    }
  });
};

export const authLocalLogout = () => {
  return new Promise(async (resolve, reject) => {
    try {
      delete axios.defaults.headers.common["Authorization"];
      store.set("auth/me", {});
      localStorage.removeItem("jwt");

      resolve();
    } catch {
      reject();
    }
  });
};

export const authLocalRegister = request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post("/auth/local/register", {
        ...request
      });

      const { jwt, user } = response.data;

      localStorage.setItem("jwt", jwt);
      axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
      store.set("auth/me", user);

      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const authUsersMe = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = null;
      if (!Object.keys(store.get("auth/me")).length) {
        response = await axios.get("/users/me");

        const user = response.data;
        if (user.role.name !== "Authenticated") {
          store.set("auth/me", user);
        } else {
          throw new Error();
        }
      } else {
        response = await axios.get("/custom/users/checkauth");
      }

      resolve(response.data);
    } catch (error) {
      delete axios.defaults.headers.common["Authorization"];
      store.set("auth/me", {});
      localStorage.removeItem("jwt");

      reject(error);
    }
  });
};

export const authForgotPassword = email => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post("/auth/forgot-password", {
        email
      });

      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const authResetPassword = (code, password, passwordConfirmation) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post("/auth/reset-password", {
        code,
        password,
        passwordConfirmation
      });

      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
