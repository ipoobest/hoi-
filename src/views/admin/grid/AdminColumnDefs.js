import $Moment from "@/utils/Moment.js";

const columnDefs = [
  {
    headerName: "username",
    field: "username",
    width: 180,
    pinned: "left",
    suppressMenu: true,
    cellRendererFramework: "AdminId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "role",
    field: "role.name",
    width: 180,
    suppressMenu: true,
    cellRendererFramework: "Role",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "block",
    field: "blocked",
    width: 100,
    suppressMenu: true,
    cellRendererFramework: "Block",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "created_at",
    field: "createdAt",
    width: 180,
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "last_logedin_date",
    field: "lastLoginedAt",
    width: 180,
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
