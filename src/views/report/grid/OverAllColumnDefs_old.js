import $Numeral from "@/utils/Numeral.js";

const columnDefs = [
  {
    headerName: "product_code",
    field: "code",
    pinned: "left",
    width: 150,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "OverallLink",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "name",
    pinned: "left",
    width: 180,
    filter: "agTextColumnFilter",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "thaiName",
    pinned: "left",
    width: 180,
    filter: "agTextColumnFilter",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "orders",
    field: "totalOrders",
    width: 150,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "items",
    field: "totalOrderItems",
    width: 150,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "amount_announced",
    field: "totalAmountHavingResult",
    width: 180,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_amount",
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
    headerName: "profit_loss_member",
    field: "totalUserProfit",
    width: 200,
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
    headerName: "profit_loss_company",
    field: "totalProfit",
    width: 200,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "info-score",
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
    cellClass: "bad-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "profit",
    field: "totalProfitPercent",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00") + "%",
    cellClass: "good-score",
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
