import axios from "@/api/axios.js";
import moment from "moment";

export const getSystemTime = async () => {
  const response = await axios.get("/custom/system/time");
  return moment(response.data).add(response.duration, "milliseconds");
};
