import $Numeral from "@/utils/Numeral.js";
import { profitClass } from "./Formatter";

const columnDefs = [
  {
    headerName: "type",
    field: "type",
    width: 125,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bet_amount",
    field: "totalAmount",
    width: 125,
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
    field: "totalDiscount",
    width: 125,
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
    width: 125,
    filter: "agNumberColumnFilter",
    cellClass: profitClass,
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
    field: "totalProfit",
    width: 125,
    filter: "agNumberColumnFilter",
    cellClass: profitClass,
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
