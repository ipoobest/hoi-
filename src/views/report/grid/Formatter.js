import { textProfitClass } from "@/utils/ClassUtil";

export const profitClass = params => {
  if (params.value) {
    return textProfitClass(params.value);
  }
  return null;
};

export const lossClass = params => {
  if (params.value) {
    return "red--text";
  }
  return null;
};
