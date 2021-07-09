import $Numeral from "@/utils/Numeral.js";

const columnDefs = [
  {
    headerName: "3_numbers",
    field: "result3Top",
    width: 120,
    cellClass: "info-score",
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "2_numbers",
    field: "result2Under",
    width: 120,
    cellClass: "info-score",
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_pay",
    width: 130,
    field: "loss",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "bad-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_pay_pencentage",
    field: "lossPercent",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00") + "%",
    cellClass: "bad-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_top",
    width: 130,
    field: "lossTop",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "bad-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_top_pencentage",
    field: "lossTopPercent",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00") + "%",
    cellClass: "bad-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_under",
    width: 130,
    field: "lossUnder",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "bad-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_under_pencentage",
    field: "lossUnderPercent",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00") + "%",
    cellClass: "bad-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_profit",
    field: "profit",
    width: 130,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "good-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_profit_percentage",
    field: "profitPercent",
    width: 130,
    sort: "desc",
    valueFormatter: params => $Numeral(params.value).format("0,0.00") + "%",
    cellClass: "good-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "profit_top",
    field: "profitTop",
    width: 130,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "good-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "profit_top_pencentage",
    field: "profitTopPercent",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00") + "%",
    cellClass: "good-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "profit_under",
    field: "profitUnder",
    width: 130,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: "good-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "profit_under_pencentage",
    field: "profitUnderPercent",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00") + "%",
    cellClass: "good-score",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_direct_2_top",
    field: "lossDirect2Top",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_direct_2_under",
    field: "lossDirect2Under",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_run_top",
    field: "lossRun3Top",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_run_under",
    field: "lossRun2Under",
    width: 125,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_direct_3_top",
    field: "lossDirect3Top",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "pay_tood",
    field: "lossTood3Top",
    width: 120,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_win",
    field: "countAll",
    valueGetter: params =>
      params.data.countDirect2Top +
      "/" +
      params.data.countDirect2Under +
      "/" +
      params.data.countRun3Top +
      "/" +
      params.data.countRun2Under +
      "/" +
      params.data.countDirect3Top +
      "/" +
      params.data.countTood3Top,
    width: 170,
    filter: false,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_win_top",
    field: "countTop",
    valueGetter: params =>
      params.data.countDirect2Top +
      "/" +
      params.data.countRun2Under +
      "/" +
      params.data.countDirect3Top +
      "/" +
      params.data.countTood3Top,
    width: 170,
    filter: false,
    suppressMenu: true,
    hide: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_win_under",
    field: "countUnder",
    valueGetter: params =>
      params.data.countDirect2Under + "/" + params.data.countRun2Under,
    width: 250,
    filter: false,
    suppressMenu: true,
    hide: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
