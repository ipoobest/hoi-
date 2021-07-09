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
