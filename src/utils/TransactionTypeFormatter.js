const values = {
  DEPOSIT: "ฝาก",
  WITHDRAWAL: "ถอน"
};

const getTransactionTypeByKey = key => {
  return values[key] || key;
};

export { getTransactionTypeByKey };
