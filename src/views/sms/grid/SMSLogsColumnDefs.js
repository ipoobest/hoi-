import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

const columnDefs = [
  {
    headerName: "sender-name",
    field: "senderName",
    width: 180,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "type",
    field: "type",
    width: 180,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    cellRendererFramework: "SmsType",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "message",
    field: "message",
    width: 180,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "phones",
    field: "phones",
    width: 180,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "provider-name",
    field: "providerName",
    width: 180,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "status",
    field: "sendSuccess",
    width: 160,
    valueFormatter: params => params.value !== "" ? (params.value ? "สำเร็จ" : "ล้มเหลว") : "",
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "last_ip_address",
    field: "ipAddress",
    width: 170,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "created_at",
    field: "createdAt",
    width: 200,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    valueFormatter: params => params.value ? $Moment(params.value).format("L HH:mm:ss") : "",
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "price",
    field: "price",
    width: 100,
    cellClass: "text-right",
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "qty",
    field: "qty",
    width: 100,
    cellClass: "text-right",
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "amount",
    field: "amount",
    width: 150,
    cellClass: "text-right",
    filter: "agNumberColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  }
];

export { columnDefs };
