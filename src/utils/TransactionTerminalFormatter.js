const values = {
  MEMBER_SITE: "web_site",
  MOBILE_SITE: "mobile_site",
  BACK_OFFICE: "back_office",
  APPS: "mobile_application",
  SYSTEM: "system"
};

const getTransactionTerminalByKey = key => {
  return values[key] || key;
};

export { getTransactionTerminalByKey };
