import $Moment from "@/utils/Moment.js";

import { classStatusRejectReason } from "./Formatter.js";

const columnDefs = [
  {
    headerName: "reject-reason",
    field: "name",
    pinned: "left",
    headerCheckboxSelection: false,
    checkboxSelection: true,
    width: 450,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "status",
    field: "active",
    width: 120,
    cellClass: classStatusRejectReason,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n",
    cellRendererFramework: "RejectReasonStatus"
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
    headerName: "updated_at",
    field: "updatedAt",
    width: 180,
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
