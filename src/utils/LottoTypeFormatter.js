const { uniqBy } = require("lodash");

const lottoTypes = {
  DIRECT3TOP: "3 ตัวบน",
  DIRECT3UNDER: "3 ตัวล่าง",
  TOOD3TOP: "โต๊ด 3 ตัวบน",
  DIRECT2TOP: "2 ตัวบน",
  DIRECT2UNDER: "2 ตัวล่าง",
  // TOOD2TOP: "โต๊ด 2 ตัวบน",
  RUN3TOP: "วิ่ง 3 ตัวบน",
  // RUN2TOP: "วิ่ง 2 ตัวบน",
  RUN2UNDER: "วิ่ง 2 ตัวล่าง",
  DIRECT3FRONT: "3 ตัวหน้า",
  DIRECTRESULT: "หวยตรง",
  TOODRESULT: "หวยโต๊ด"
};

const getLottoTypeByKey = key => {
  return lottoTypes[key] || key;
};

const getLottoLengthByKey = key => {
  if (key.includes("RUN")) {
    return 1;
  } else {
    const regex = /\d+/;
    return regex.exec(key)[0];
  }
};

const extractNumberToTood = num => {
  const result = [];
  for (let x = 0; x < num.length; x++) {
    for (let y = 0; y < num.length; y++) {
      for (let z = 0; z < num.length; z++) {
        if (x != y && y != z && z != x) {
          result.push(num[x] + num[y] + num[z]);
        }
      }
    }
  }
  return uniqBy(result);
};

export {
  lottoTypes,
  getLottoTypeByKey,
  getLottoLengthByKey,
  extractNumberToTood
};
