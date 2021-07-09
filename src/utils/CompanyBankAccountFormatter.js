const values = {
  PAY: "pay_only",
  RECEIVE: "receive_only",
  BOTH: "pay_and_receive"
};

const getCompanyBankAccountTypeByKey = key => {
  return values[key] || key;
};

export { getCompanyBankAccountTypeByKey };
