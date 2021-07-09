const values = {
  ATM: "ATM",
  INTERNET_BANKING: "Internet Banking",
  MOBILE_BANKING: "MOBILE_BANKING"
};

const getTransactionChannelByKey = key => {
  return values[key] || key;
};

export { getTransactionChannelByKey };
