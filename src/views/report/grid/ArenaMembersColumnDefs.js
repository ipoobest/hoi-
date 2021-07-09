import $Moment from "@/utils/Moment.js";
import $Numeral from "@/utils/Numeral.js";
import { profitClass } from "./Formatter";

const columnDefs = [
  {
    headerName: "#",
    field: "no",
    width: 100,
    sortable: false,
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
    valueFormatter: params => $Moment(params.value).format("DD/MM HH:mm:ss"),
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "order_no",
    field: "billNo",
    width: 150,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "opened_Username",
    field: "openedUsername",
    width: 125,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    // cellRendererFramework: "PlayerMemberId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  // {
  //   headerName: "opened_Parent_Username",
  //   field: "openedParentUsername",
  //   width: 125,
  //   suppressMenu: true,
  //   pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
  //   // cellRendererFramework: "PlayerParentId",
  //   headerComponentFramework: "AgGridHeaderI18n"
  // },
  // {
  //   headerName: "opened_User_Choose",
  //   field: "openedUserChoose",
  //   width: 125,
  //   suppressMenu: true,
  //   pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
  //   headerComponentFramework: "AgGridHeaderI18n"
  // },
  {
    headerName: "opened_User_Result",
    field: "openedUserResult",
    width: 125,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "closed_Username",
    field: "closedUsername",
    width: 125,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    // cellRendererFramework: "PlayerMemberId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  // {
  //   headerName: "closed_Parent_Username",
  //   field: "closedParentUsername",
  //   width: 125,
  //   suppressMenu: true,
  //   pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
  //   // cellRendererFramework: "PlayerParentId",
  //   headerComponentFramework: "AgGridHeaderI18n"
  // },
  // {
  //   headerName: "closed_User_Choose",
  //   field: "closedUserChoose",
  //   width: 125,
  //   suppressMenu: true,
  //   pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
  //   headerComponentFramework: "AgGridHeaderI18n"
  // },
  {
    headerName: "closed_User_Result",
    field: "closedUserResult",
    width: 125,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_Amount",
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
    headerName: "total_Fee",
    field: "totalFee",
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
    headerName: "total_Reward",
    field: "totalReward",
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
    headerName: "total_Profit",
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
  },
  // {
  //   headerName: "opened_By_Bot",
  //   field: "openedByBot",
  //   width: 125,
  //   valueFormatter: params => params.value !== "" ? (params.value ? "ใช้" : "ไม่ใช้") : "",
  //   suppressMenu: true,
  //   pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
  //   headerComponentFramework: "AgGridHeaderI18n"
  // },
  // {
  //   headerName: "closed_By_Bot",
  //   field: "closedByBot",
  //   width: 125,
  //   valueFormatter: params => params.value !== "" ? (params.value ? "ใช้" : "ไม่ใช้") : "",
  //   suppressMenu: true,
  //   pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
  //   headerComponentFramework: "AgGridHeaderI18n"
  // },
  {
    headerName: "opened_User_Ip_Address",
    field: "openedUserIpAddress",
    width: 125,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "closed_User_Ip_Address",
    field: "closedUserIpAddress",
    width: 125,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
];

export { columnDefs };
