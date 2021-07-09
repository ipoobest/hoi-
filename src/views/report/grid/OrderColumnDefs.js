import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";
import { getOrderStatusStyleByKey } from "@/utils/OrderStatusFormatter.js";

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
    field: "username",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    cellRendererFramework: "PlayerMemberId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "status",
    field: "status",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    cellStyle: params => getOrderStatusStyleByKey(params.value),
    cellRendererFramework: "OrderStatus",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "type",
    field: "productName",
    width: 110,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "type",
    field: "productThaiName",
    width: 110,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product_type",
    field: "type",
    width: 140,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    cellRendererFramework: "ProductType",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "lottoName",
    width: 300,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "lottoThaiName",
    width: 300,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
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
  },
  {
    headerName: "pay_amount",
    field: "totalReward",
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
    field: "totalProfit",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
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
