import $Moment from "@/utils/Moment.js";

const columnDefs = [
  {
    headerName: "username",
    field: "username",
    width: 180,
    pinned: "left",
    suppressMenu: true,
    cellRendererFramework: "MemberId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "ip_address",
    field: "ipAddress",
    width: 150,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "reason",
    field: "reason",
    width: 400,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "created_at",
    field: "createdAt",
    width: 180,
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
