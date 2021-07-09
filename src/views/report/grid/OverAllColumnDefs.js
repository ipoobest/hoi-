import $Numeral from "@/utils/Numeral.js";
import { profitClass, lossClass } from "./Formatter";

const columnDefs = [
  {
    headerName: "product_code",
    field: "productLottoCode",
    width: 150,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "productLottoName",
    width: 180,
    filter: "agTextColumnFilter",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "productLottoThaiName",
    width: 180,
    filter: "agTextColumnFilter",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bet_amount",
    field: "totalAmount",
    width: 150,
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "Affiliate",
    field: "totalAffiliate",
    width: 150,
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "net_amount",
    field: "totalNet",
    width: 150,
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "prize",
    field: "totalReward",
    width: 180,
    filter: "agNumberColumnFilter",
    cellClass: lossClass,
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "profit",
    width: 130,
    field: "totalProfit",
    filter: "agNumberColumnFilter",
    cellClass: profitClass,
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
