import $Numeral from "@/utils/Numeral.js";
import $Moment from "@/utils/Moment.js";

const columnDefs = [
  {
    headerName: "sms-provider-name",
    field: "smsProviderName",
    width: 150,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "sms-price",
    field: "smsPrice",
    width: 120,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total-sms-sent",
    field: "totalSmsSent",
    width: 140,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "sms-credit",
    field: "smsCredit",
    width: 120,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "limit-sms-credit",
    field: "limitSmsCredit",
    width: 140,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "overdue-sms-credit",
    field: "overdueSmsCredit",
    width: 150,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "otp-provider-name",
    field: "otpProviderName",
    width: 150,
    filter: "agTextColumnFilter",
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "otp-price",
    field: "otpPrice",
    width: 120,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total-otp-sent",
    field: "totalOtpSent",
    width: 140,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "otp-credit",
    field: "otpCredit",
    width: 120,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "limit-otp-credit",
    field: "limitOtpCredit",
    width: 150,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "overdue-otp-credit",
    field: "overdueOtpCredit",
    width: 140,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "total-overdue-credit",
    field: "totalOverdueCredit",
    width: 120,
    filter: "agTextColumnFilter",
    valueFormatter: params => $Numeral(params.value).format("0,0.00"),
    suppressMenu: true,
    headerComponentFramework: "AgGridHeaderI18n"
  },
  {
    headerName: "report-at",
    field: "reportAt",
    width: 120,
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
  }
];

export { columnDefs };
