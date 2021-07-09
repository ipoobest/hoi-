import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

const columnDefs = [
  {
    headerName: "username",
    field: "username",
    width: 180,
    pinned: "left",
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "IncomeMember",
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
    headerName: "type",
    field: "type",
    width: 180,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "IncomeType",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "from",
    field: "referenceUsername",
    width: 180,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "ReferenceMember",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pure_amount",
    field: "amount",
    width: 180,
    filter: "agNumberColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
