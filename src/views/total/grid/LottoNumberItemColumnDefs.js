import $Moment from "@/utils/Moment.js";
import $Numeral from "@/utils/Numeral.js";

const columnDefs = [
  {
    headerName: "#",
    field: "no",
    width: 100,
    valueFormatter: params => {
      if (params.data) {
        if (isNaN(params.value)) {
          return params.value;
        } else {
          return $Numeral(params.value).format("0,0");
        }
      }
      return null;
    },
    suppressMenu: true
  },
  {
    headerName: "created_at",
    field: "createdAt",
    width: 150,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    valueFormatter: params => $Moment(params.value).format("DD/MM HH:mm:ss"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "order_no",
    field: "billNo",
    width: 150,
    suppressMenu: true,
    cellRendererFramework: "BillNo",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "username",
    field: "username",
    width: 125,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    cellRendererFramework: "PlayerMemberId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "parent_member",
    field: "parentUsername",
    width: 125,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    cellRendererFramework: "PlayerParentId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "number",
    field: "number",
    width: 125,
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "rate",
    field: "rate",
    width: 125,
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bet_amount",
    field: "price",
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
    headerName: "pay_amount",
    field: "pay",
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
    headerName: "ip_address",
    field: "ipAddress",
    width: 160,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
