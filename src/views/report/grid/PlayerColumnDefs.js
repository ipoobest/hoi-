import $Numeral from "@/utils/Numeral.js";

const columnDefs = [
  {
    headerName: "username",
    field: "username",
    pinned: "left",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "PlayerMemberId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "phone",
    field: "phone",
    width: 180,
    filter: "agTextColumnFilter",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "parent_member",
    field: "parentUsername",
    width: 180,
    filter: "agTextColumnFilter",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    suppressMenu: true,
    cellRendererFramework: "PlayerParentId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bet_amount",
    width: 180,
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
    width: 180,
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
    headerName: "prize",
    field: "totalReward",
    width: 180,
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
    headerName: "net_amount",
    field: "totalProfit",
    width: 180,
    valueFormatter: params =>
      params.value && $Numeral(params.value.toFixed(2)).format("0,0.00"),
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
