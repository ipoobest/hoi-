import $Moment from "@/utils/Moment.js";
import $Numeral from "@/utils/Numeral.js";

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
    headerName: "product2",
    field: "productLottoName",
    width: 150,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "product2",
    field: "productLottoThaiName",
    width: 150,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  // {
  //   headerName: "round",
  //   field: "lottoResultedAt",
  //   width: 125,
  //   suppressMenu: true,
  //   valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
  //   headerComponentFramework: "AgGridHeaderI18n"
  // },
  {
    headerName: "remark",
    field: "useTimeInMilliseconds",
    width: 110,
    suppressMenu: true,
    valueFormatter: params => {
      if (params.value) {
        return "R: " + $Numeral(params.value / 1000).format("0.000");
      }
      return "";
    },
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "items",
    field: "totalOrderItems",
    width: 100,
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0"),
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
    headerName: "ip_address",
    field: "ipAddress",
    width: 160,
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
