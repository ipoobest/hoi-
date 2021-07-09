const values = {
  WAITING: "waiting_announce",
  CANCELLED: "cancelled",
  FINISHED: "announced"
};

const getOrderStatusByKey = key => {
  return values[key] || key;
};

const getOrderStatusStyleByKey = key => {
  if (key === "WAITING") {
    return null;
  } else if (key === "CANCELLED") {
    return { color: "red" };
  } else if (key === "FINISHED") {
    return { color: "green" };
  } else {
    return null;
  }
};

export { getOrderStatusByKey, getOrderStatusStyleByKey };
