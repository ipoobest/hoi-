import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";
import { getOrderStatusStyleByKey } from "@/utils/OrderStatusFormatter";

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
    headerName: "status",
    field: "status",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellStyle: params => getOrderStatusStyleByKey(params.value),
    cellRendererFramework: "OrderStatus",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "username",
    field: "username",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "PlayerMemberId",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bet_amount",
    width: 130,
    field: "totalAmount",
    valueFormatter: params => {
      if (params && params.data && params.data.status === "CANCELLED") {
        return "-";
      }
      return $Numeral(params.value).format("0,0.00");
    },
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
    valueFormatter: params => {
      if (params && params.data && params.data.status === "CANCELLED") {
        return "-";
      }
      return $Numeral(params.value).format("0,0.00");
    },
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
    valueFormatter: params => {
      if (params && params.data && params.data.status === "CANCELLED") {
        return "-";
      }
      return $Numeral(params.value).format("0,0.00");
    },
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
    valueFormatter: params => {
      if (params && params.data && params.data.status === "CANCELLED") {
        return "-";
      }
      return $Numeral(params.value).format("0,0.00");
    },
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
    valueFormatter: params => {
      if (params && params.data && params.data.status === "CANCELLED") {
        return "-";
      }
      return $Numeral(params.value).format("0,0.00");
    },
    cellClass: "good-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "refund",
    width: 120,
    field: "totalCancelOrder",
    valueFormatter: params => {
      if (params && params.data && params.data.status === "CANCELLED") {
        return $Numeral(params.data.totalAmount).format("0,0.00");
      } else if (params && params.data && params.data._id === "รวม") {
        return $Numeral(params.data.totalCancelOrder).format("0,0.00");
      }
      return "-";
    },
    cellClass: "warning-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "created_at",
    field: "createdAt",
    width: 200,
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
