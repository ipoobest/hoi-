import { textProfitClass } from "@/utils/ClassUtil";

export const classStatus = params => {
  if (params.value === "OPEN") {
    return "grey--text";
  } else if (["APPROVED", "AUTO_APPROVED"].includes(params.value)) {
    return "green--text";
  } else if (["REJECTED", "AUTO_REJECTED"].includes(params.value)) {
    return "red--text";
  } else if (params.value === "IN_REVIEW") {
    return "warning--text";
  }
};

export const classStatusRejectReason = params => {
  if (params.value) {
    return "green--text";
  } else {
    return "red--text";
  }
};

export const colorType = params => {
  if (params.value === "DEPOSIT") {
    return "success";
  } else if (params.value === "WITHDRAWAL") {
    return "primary";
  } else if (params.value === "ADJUSTMENT") {
    return "warning";
  } else {
    return "";
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
