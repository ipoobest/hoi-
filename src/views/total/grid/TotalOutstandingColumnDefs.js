import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

import { bankAccountCodeFormatter } from "@/utils/StringMask.js";
import { getBankStatusByKey } from "@/utils/BankStatusFormatter.js";

import { classStatus } from "./Formatter.js";

const columnDefs = [
  {
    headerName: "order_no",
    field: "billNo",
    width: 125,
    pinned: "left",
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
  },
  {
    headerName: "username",
    field: "username",
    width: 150,
    suppressMenu: true,
    cellRendererFramework: "MemberId",
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
    field: "bank.thaiName",
    width: 200,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "deposit-all",
    field: "totalDeposit",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "withdraw-all",
    field: "totalWithdrawal",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "status",
    field: "status",
    width: 100,
    cellClass: classStatus,
    valueFormatter: params => getBankStatusByKey(params.value),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "action",
    field: "_id",
    width: 150,
    suppressMenu: true,
    cellRendererFramework: "BankAction",
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
