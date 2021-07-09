import $Numeral from "@/utils/Numeral.js";

const columnDefs = [
  {
    headerName: "username",
    field: "username",
    width: 180,
    pinned: "left",
    suppressMenu: true,
    cellRendererFramework: "Member",
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
    headerName: "parent_member",
    field: "parentUsername",
    width: 180,
    suppressMenu: true,
    cellRendererFramework: "ParentMember",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "affiliate_children",
    field: "totalAffiliate",
    width: 180,
    valueFormatter: params => $Numeral(params.value).format("0,0"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
