import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

const columnDefs = [
  {
    headerName: "no_number",
    field: "no",
    width: 80,
    pinned: "left",
    suppressMenu: true,
    sortable: false,
    valueFormatter: params => $Numeral(params.value).format("0,0"),
    headerComponentFramework: "AgGridHeaderI18n"
  },
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
    headerName: "first_ip_address",
    field: "createdIpAddress",
    width: 180,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "last_ip_address",
    field: "lastIpAddress",
    width: 180,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "phone",
    field: "phone",
    width: 180,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "verify_phone",
    field: "phoneVerified",
    width: 200,
    valueFormatter: params => (params.value ? "ยืนยัน" : "รอการยืนยัน"),
    suppressMenu: true,
    cellRendererFramework: "VerifyPhone",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "parent_member",
    field: "parentUsername",
    width: 180,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "type",
    field: "type",
    width: 100,
    suppressMenu: true,
    cellRendererFramework: "Type",
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
  },
  {
    headerName: "balance2",
    field: "balance",
    width: 180,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "affiliate_balace",
    field: "affiliateBalance",
    width: 180,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "deposit-all",
    field: "totalDeposit",
    width: 180,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "withdraw-all",
    field: "totalWithdrawal",
    width: 180,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total-bet",
    field: "totalBet",
    width: 180,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_reward",
    field: "totalReward",
    width: 180,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_affiliate",
    field: "totalAffiliateAmount",
    width: 180,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
