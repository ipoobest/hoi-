const values = {
  OPEN: "waiting-approve",
  APPROVED: "approved",
  REJECTED: "rejected",
  IN_REVIEW: "in-review",
  IN_PROGRESS: "processing",
  AUTO_REJECTED: "auto-rejected",
  AUTO_APPROVED: "auto-approved",
  DELETED: "deleted",
  WAITING: "waiting",
  WITHDRAWAL: "withdrawing"
};

const getTransactionStatusByKey = key => {
  return values[key] || key;
};

export { getTransactionStatusByKey };
