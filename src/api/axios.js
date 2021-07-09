const axios = require("axios");

axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
if (localStorage.getItem("jwt")) {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("jwt");
}

export default axios;
