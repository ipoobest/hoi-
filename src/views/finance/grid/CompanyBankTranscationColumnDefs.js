import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

import { bankAccountCodeFormatter } from "@/utils/StringMask.js";

const columnDefs = [
  {
    headerName: "transaction-code",
    field: "no",
    width: 125,
    pinned: "left",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "payment_date",
    field: "transactionAt",
    width: 180,
    valueFormatter: params => $Moment(params.value).format("L HH:mm:ss"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "type",
    field: "type",
    width: 120,
    suppressMenu: true,
    cellRendererFramework: "TransactionType",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "amount",
    field: "amount",
    width: 200,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bank_no",
    field: "from",
    width: 200,
    valueFormatter: params => params.value && params.value.username,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "member-bank-name",
    field: "fromBank",
    width: 200,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "remark",
    field: "remark",
    width: 300,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
