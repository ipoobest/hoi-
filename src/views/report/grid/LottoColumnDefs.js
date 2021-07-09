import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";
import { getProductTypeByKey } from "@/utils/ProductTypeFormatter.js";

const columnDefs = [
  {
    headerName: "รหัสสินค้า",
    field: "_id",
    pinned: "left",
    width: 250,
    filter: "agTextColumnFilter",
    suppressMenu: true
  },
  {
    headerName: "ประเภท",
    field: "productConfig",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    valueFormatter: params => {
      if (params && params.data && params.data.productConfig) {
        return params.data.productConfig.thaiName;
      }
      return "";
    }
  },
  {
    headerName: "ประเภทสินค้า",
    field: "type",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    valueFormatter: params => getProductTypeByKey(params.value)
  },
  {
    headerName: "สินค้า",
    field: "thaiName",
    width: 300,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer"
  },
  {
    headerName: "ออกผลเมื่อ",
    field: "resultedAt",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss")
  },
  {
    headerName: "สร้างเมื่อ",
    field: "createdAt",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss")
  },
  {
    headerName: "ยอดพนัน",
    width: 130,
    field: "totalAmount",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true
  },
  {
    headerName: "Affiliate",
    field: "totalDiscount",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true
  },
  {
    headerName: "ยอดสุทธิ",
    field: "totalNet",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "info-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true
  },
  {
    headerName: "ยอดจ่าย",
    field: "totalReward",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "bad-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true
  },
  {
    headerName: "กำไร",
    field: "totalProfit",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "good-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true
  }
];

export { columnDefs };
