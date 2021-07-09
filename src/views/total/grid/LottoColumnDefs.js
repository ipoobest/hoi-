import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

const columnDefs = [
  {
    headerName: "product_code",
    field: "code",
    pinned: "left",
    width: 150,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "type",
    field: "productName",
    pinned: "left",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "type",
    field: "productThaiName",
    pinned: "left",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product_type",
    field: "productLottoName",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product_type",
    field: "productLottoThaiName",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "name",
    width: 300,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "thaiName",
    width: 300,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "announced_date",
    field: "resultedAt",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "created_at",
    field: "createdAt",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
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
    suppressMenu: true
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
