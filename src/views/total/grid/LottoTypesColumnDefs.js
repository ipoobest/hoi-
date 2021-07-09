import $Numeral from "@/utils/Numeral.js";

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
    headerName: "net_amount",
    field: "totalNet",
    width: 125,
    filter: "agNumberColumnFilter",
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
