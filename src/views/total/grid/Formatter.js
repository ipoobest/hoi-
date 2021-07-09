import { textProfitClass } from "@/utils/ClassUtil";

export const classStatus = params => {
  if (params.value === "WAITING") {
    return "info--text";
  } else if (params.value === "APPROVED") {
    return "green--text";
  } else if (params.value === "REJECTED") {
    return "red--text";
  } else if (params.value === "DELETED") {
    return "grey--text";
  }
};

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
