const smsTransactionTypes = {
  AUTO: "sms-type-auto",
  SINGLE: "sms-type-single",
  MANY: "sms-type-many",
  FORGET_PASSWORD: "sms-type-forget_password",
  PHONE_VERIFY: "sms-type-phone_verify",
  CHANGE_PHONE: "sms-type-chang_phone"
};

const getSMSTransactionTypeByKey = key => {
  return smsTransactionTypes[key] || key;
};

export { getSMSTransactionTypeByKey, smsTransactionTypes };
