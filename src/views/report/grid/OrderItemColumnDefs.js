import $Numeral from "@/utils/Numeral.js";
import { profitClass, lossClass } from "./Formatter";

const columnDefs = [
  {
    headerName: "#",
    field: "no",
    pinned: "left",
    width: 100,
    valueFormatter: params => {
      if (params.data) {
        if (isNaN(params.value)) {
          return params.value;
        } else {
          return $Numeral(params.value).format("0,0");
        }
      }
      return null;
    },
    suppressMenu: true,
    filter: "agTextColumnFilter"
  },
  {
    headerName: "type",
    field: "type",
    pinned: "left",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    cellRendererFramework: "Type",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "number",
    field: "number",
    pinned: "left",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    comparator: (item1, item2) => {
      if (item1 && item2) {
        let newItem1 = item1.padStart(3, "0");
        let newItem2 = item2.padStart(3, "0");
        if (newItem1 < newItem2) return -1;
        if (newItem1 > newItem2) return 1;
        return 0;
      }
      return 0;
    },
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "winloss",
    field: "win",
    pinned: "left",
    width: 120,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    cellRendererFramework: "Status",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "rate",
    field: "rate",
    width: 120,
    valueFormatter: params =>
      params.value && $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "bet_amount",
    field: "amount",
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
    headerName: "Affiliate (%)",
    field: "discountPercent",
    width: 120,
    valueFormatter: params => {
      return $Numeral(params.value * 100).format("0,0.00");
    },
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "net_amount",
    field: "net",
    width: 180,
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
    headerName: "pay_amount",
    field: "reward",
    width: 180,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    cellClass: lossClass,
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "profit",
    field: "profit",
    width: 180,
    valueFormatter: params => {
      if (params.data && !params.data.summary) {
        if (params.data.status !== "DELETED") {
          return $Numeral(params.data.net - params.data.reward).format(
            "0,0.00"
          );
        } else {
          return "0.00";
        }
      }
      return $Numeral(params.value).format("0,0.00");
    },
    cellClass: params => {
      if (params.data && params.data.status !== "DELETED") {
        return profitClass({ value: params.data.net - params.data.reward });
      }
      return null;
    },
    comparator: (_1, _2, item1, item2) => {
      if (item1 && item2 && item1.data.status !== "DELETED") {
        let newItem1 = item1.data.net - item1.data.reward;
        let newItem2 = item2.data.net - item2.data.reward;
        if (newItem1 < newItem2) return -1;
        if (newItem1 > newItem2) return 1;
        return 0;
      }
      return 0;
    },
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
