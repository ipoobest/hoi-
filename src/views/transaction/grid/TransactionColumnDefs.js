import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

import { bankAccountCodeFormatter } from "@/utils/StringMask.js";

import { classStatus } from "./Formatter.js";

const columnDefs = [
  {
    headerName: "transaction-code",
    field: "_id",
    width: 160,
    pinned: "left",
    suppressMenu: true,
    cellRendererFramework: "TransactionId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "date",
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
    field: "userBankAccount.accountName",
    width: 200,
    valueFormatter: params => params.value || "-",
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
    headerName: "action-by",
    width: 150,
    suppressMenu: true,
    cellRendererFramework: "AdminId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "amount",
    field: "amount",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "remark",
    field: "remark",
    width: 250,
    cellClass: "text-right",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "fee",
    field: "fee",
    width: 150,
    cellClass: "text-right red--text",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "member-bank-no",
    field: "userBankAccount.accountCode",
    width: 150,
    valueFormatter: params =>
      bankAccountCodeFormatter.apply(params.value) || "-",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "member-bank-name",
    field: "userBankAccount.bank.name",
    width: 200,
    valueFormatter: params => params.value || "-",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "member-bank-name",
    field: "userBankAccount.bank.thaiName",
    width: 200,
    valueFormatter: params => params.value || "-",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "company-bank-no",
    field: "companyBankAccount.accountCode",
    width: 150,
    valueFormatter: params =>
      bankAccountCodeFormatter.apply(params.value) || "-",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "company-bank-name",
    field: "companyBankAccount.bank.name",
    width: 200,
    valueFormatter: params => params.value || "-",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "company-bank-name",
    field: "companyBankAccount.bank.thaiName",
    width: 200,
    valueFormatter: params => params.value || "-",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
