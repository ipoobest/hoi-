import $Numeral from "@/utils/Numeral.js";

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
  }
];

export { columnDefs };
