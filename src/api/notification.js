import axios from "@/api/axios.js";
import store from "@/store";
import moment from "moment";

export const getNotification = async () => {
  const response = await axios.get("/notifications/all");
  return response.data;
};

export const countNotification = async () => {
  const user = store.get("auth/me");
  if (user.clickNotificationAt) {
    const response = await axios.get(
      "/notifications/count?_sort=createdAt:DESC&_limit=10&createdAt_gte=" +
        encodeURIComponent(
          moment(user.clickNotificationAt).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        )
    );
    return response.data;
  } else {
    return 0;
  }
};
