import $Numeral from "@/utils/Numeral.js";

const columnDefs = [
  {
    headerName: "username",
    field: "username",
    pinned: "left",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "AffiliateMemberId",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "level",
    field: "level",
    width: 100,
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0"),
    filter: "agNumberColumnFilter",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "Affiliate (%)",
    field: "percentShare",
    width: 120,
    filter: "agTextColumnFilter",
    pinnedRowCellRenderer: "blankPinnedRowCellRenderer",
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value * 100).format("0,0.00"),
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
        "</div>"
    },
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total_amount",
    field: "amount",
    width: 200,
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
        "</div>"
    },
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "Affiliate",
    field: "share",
    width: 200,
    suppressMenu: true,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    filter: "agNumberColumnFilter",
    cellStyle: {
      display: "flex",
      "justify-content": "flex-end"
    },
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
        "</div>"
    },
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
