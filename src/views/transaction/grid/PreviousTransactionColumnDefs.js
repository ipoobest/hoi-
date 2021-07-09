import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

import { classStatus } from "./Formatter.js";

const columnDefs = [
  {
    headerName: "transaction",
    field: "_id",
    width: 160,
    pinned: "left",
    suppressMenu: true,
    cellRendererFramework: "TransactionId",
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
    headerName: "type",
    field: "type",
    width: 100,
    suppressMenu: true,
    cellRendererFramework: "TransactionType",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "status",
    field: "status",
    width: 150,
    cellClass: classStatus,
    suppressMenu: true,
    cellRendererFramework: "Status",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "remark",
    field: "remark",
    width: 250,
    valueFormatter: params => {
      if (!params.data || (!params.data.rejectReason && !params.data.remark)) {
        return "-";
      } else {
        return `${params.data.rejectReason || ""} ${params.data.remark || ""}`;
      }
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "debit",
    field: "amount",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => {
      if (params.data && params.data.pocketType === "DEBIT") {
        return $Numeral(params.value).format("0,0.00");
      } else {
        return "-";
      }
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "credit",
    field: "amount",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => {
      if (params.data && params.data.pocketType === "CREDIT") {
        return $Numeral(params.value).format("0,0.00");
      } else {
        return "-";
      }
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
