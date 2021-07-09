import $Numeral from "@/utils/Numeral.js";

const columnDefs = [
  {
    headerName: "order_no",
    field: "billNo",
    pinned: "left",
    width: 250,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "username",
    field: "user",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "MemberId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bet_amount",
    width: 130,
    field: "totalAmount",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
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
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "net_amount",
    field: "totalNet",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "info-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
