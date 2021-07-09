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
    headerName: "level",
    field: "level",
    width: 120,
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
    headerName: "affiliate_balace",
    field: "affiliateBalance",
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
  },
  {
    headerName: "affiliate_withdrawal_amount",
    field: "totalAffiliateWithdrawal",
    width: 180,
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
