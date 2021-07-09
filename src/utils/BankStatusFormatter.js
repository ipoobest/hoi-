const values = {
  WAITING: "รออนุมัติ",
  APPROVED: "อนุมัติ",
  REJECTED: "ปฏิเสธ",
  DELETED: "ถูกลบ"
};

const getBankStatusByKey = key => {
  return values[key] || key;
};

export { getBankStatusByKey };
