import $Numeral from "@/utils/Numeral.js";

const columnDefs = [
  {
    headerName: "total_deposit",
    field: "totalDeposit",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_withdrawal",
    field: "totalWithdrawal",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "withdraw_to_approve",
    field: "totalWithdrawalOpen",
    width: 160,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_adjustment",
    field: "totalAdjustment",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "profit_loss",
    field: "profit",
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
  },
  {
    headerName: "total_reward",
    field: "totalReward",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_bet",
    field: "totalBet",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_bet_today",
    field: "todayBet",
    width: 150,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_bet_past_7_days",
    field: "totalBetInLast7Days",
    width: 200,
    cellClass: "text-right",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
