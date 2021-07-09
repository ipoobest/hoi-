const productTypes = {
  LOTTO: "lottos",
  YEEKEE: "lotto_yeekee",
  STOCK: "lotto_foreign_stock",
  SET: "lotto_set",
  ARENA: "arenas"
};

const getProductTypeByKey = key => {
  return productTypes[key] || key;
};

export { productTypes, getProductTypeByKey };
