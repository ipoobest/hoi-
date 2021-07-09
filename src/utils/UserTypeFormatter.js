const values = {
  DEBIT: "debit",
  CREDIT: "credit"
};

const getUserTypeByKey = key => {
  return values[key] || key;
};

export { getUserTypeByKey };
