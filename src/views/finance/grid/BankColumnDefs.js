const columnDefs = [
  {
    headerName: "bank_code",
    field: "code",
    width: 125,
    pinned: "left",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "logo",
    field: "shortName",
    width: 100,
    suppressMenu: true,
    cellRendererFramework: "BankLogo",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "short_name",
    field: "shortName",
    width: 150,
    valueFormatter: params => params.value.toUpperCase(),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "name",
    field: "niceName",
    width: 300,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "name",
    field: "thaiName",
    width: 300,
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "deprecate",
    field: "deprecate",
    width: 150,
    suppressMenu: true,
    cellRendererFramework: "Deprecate",
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
