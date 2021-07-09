import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

import { bankAccountCodeFormatter } from "@/utils/StringMask.js";

import { classStatus } from "./Formatter.js";

const columnDefs = [
  {
    headerName: "bank_transaction_no",
    field: "no",
    width: 125,
    pinned: "left",
    headerCheckboxSelection: false,
    checkboxSelection: true,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bank_type",
    field: "type",
    width: 120,
    suppressMenu: true,
    cellRendererFramework: "BankType",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "full-name",
    field: "accountName",
    width: 200,
    valueFormatter: params => params.value && params.value.username,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bank_no",
    field: "accountCode",
    width: 150,
    valueFormatter: params => bankAccountCodeFormatter.apply(params.value),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bank_name",
    field: "bank.name",
    width: 300,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bank_name",
    field: "bank.thaiName",
    width: 200,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "status",
    field: "active",
    width: 120,
    cellClass: classStatus,
    suppressMenu: true,
    cellRendererFramework: "Status",
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
    headerName: "updated_at",
    field: "updatedAt",
    width: 180,
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "credit",
    field: "credit",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "debit",
    field: "debit",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "balance2",
    field: "balance",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
