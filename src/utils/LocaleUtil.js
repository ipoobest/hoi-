export const getLangNameKeyFromLocale = function (locale) {
  if (locale === "th") {
    return "thaiName";
  } else {
    return "name";
  }
};

export const getLangNameKeyFromLocaleUpperCase = function (locale) {
  if (locale === "th") {
    return "ThaiName";
  } else {
    return "Name";
  }
};

export const getLangBankNameKeyFromLocale = function (locale) {
  if (locale === "th") {
    return "thaiName";
  } else {
    return "niceName";
  }
};
