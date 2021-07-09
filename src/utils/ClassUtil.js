export const textProfitClass = value => {
  if (value > 0) {
    return "green--text";
  } else if (value < 0) {
    return "red--text";
  }
  return null;
};

export const textWinLoseClass = value => {
  if (value === true) {
    return "green--text";
  } else {
    return "red--text";
  }
};
