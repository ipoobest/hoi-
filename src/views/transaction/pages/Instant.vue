<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("instant-transaction") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("instant-transaction-subtitle") }}
                </div></v-col
              >
              <v-col class="py-0 text-right">
                <div class="float-right pt-2 pl-5">
                  <v-btn
                    fab
                    small
                    :loading="fetching"
                    :disabled="fetching"
                    color="green"
                    @click="onRefreshClicked"
                  >
                    <v-icon large>mdi-refresh-circle</v-icon>
                  </v-btn>
                </div>
                <v-switch
                  v-model="enableWebsocket"
                  class="float-right"
                  :label="$t('open_close_auto_update')"
                ></v-switch>
              </v-col>
            </v-row>
          </template>

          <div style="height: 76vh">
            <ag-grid-vue
              style="height: 100%"
              class="ag-theme-alpine pt-2"
              row-model-type="infinite"
              :column-defs="columnDefs"
              :default-col-def="{
                sortable: true,
                resizable: true
              }"
              :animate-rows="true"
              :suppress-drag-leave-hides-columns="true"
              :row-drag-managed="false"
              :floating-filter="false"
              @grid-ready="onGridReady"
            />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { getPayment } from "@/api/payment.js";

import TransactionId from "@/views/transaction/grid/TransactionId";
import TransactionType from "@/views/transaction/grid/TransactionType";
import MemberId from "@/views/transaction/grid/MemberId";
import AdminId from "@/views/transaction/grid/AdminId";
import Status from "@/views/transaction/grid/Status";

import { columnDefs } from "@/views/transaction/grid/TransactionColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "Deposit",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    TransactionId,
    TransactionType,
    MemberId,
    AdminId,
    Status
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    filterStatus: null,
    filterUsername: null,

    fetching: false,

    enableWebsocket: true
  }),
  created() {
    this.doRefreshGrid = false;
    this.worker = setInterval(() => {
      if (this.doRefreshGrid && this.enableWebsocket) {
        this.doRefreshGrid = false;
        this.onRefreshClicked();
      }
    }, 5000);
    this.$EventBus.$on(
      "onWebSocketPaymentTransaction",
      this.onWebSocketPaymentTransaction
    );
    this.$EventBus.$on("onWebSocketPayment", this.onWebSocketPayment);
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    if (this.worker) {
      clearInterval(this.worker);
    }
    this.$EventBus.$off(
      "onWebSocketPaymentTransaction",
      this.onWebSocketPaymentTransaction
    );
    this.$EventBus.$off("onWebSocketPayment", this.onWebSocketPayment);
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged(locale) {
      if (locale === "th") {
        this.columnApi.setColumnsVisible(
          ["companyBankAccount.bank.thaiName", "userBankAccount.bank.thaiName"],
          true
        );
        this.columnApi.setColumnsVisible(
          ["companyBankAccount.bank.name", "userBankAccount.bank.name"],
          false
        );
      } else {
        this.columnApi.setColumnsVisible(
          ["companyBankAccount.bank.thaiName", "userBankAccount.bank.thaiName"],
          false
        );
        this.columnApi.setColumnsVisible(
          ["companyBankAccount.bank.name", "userBankAccount.bank.name"],
          true
        );
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default language
      this.onLocaleChanged(this.$i18n.locale);

      // default sort
      this.columnApi.getColumn("_id").setSort("desc");

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.fetching = true;
          this.gridApi.showLoadingOverlay();

          const req =
            "&status=OPEN&status=IN_REVIEW&status=IN_PROGRESS&status=WITHDRAWAL&status=AUTO_REJECTED";
          getPayment(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            req
          )
            .then(data => {
              let lastRow = -1;
              if (data.length < params.endRow - params.startRow) {
                lastRow =
                  params.endRow -
                  (params.endRow - params.startRow - data.length);
              }
              params.successCallback(data, lastRow);
              this.fetching = false;
              this.gridApi.hideOverlay();
            })
            .catch(error => {
              this.fetching = false;
              this.gridApi.hideOverlay();
            });
        }
      });
    },
    onRefreshClicked() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
    },
    onWebSocketPayment(data) {
      this.doRefreshGrid = true;
    },
    onWebSocketPaymentTransaction(data) {
      if (
        data._id &&
        [
          "AUTO_REJECTED",
          "AUTO_APPROVED",
          "IN_PROGRESS",
          "WITHDRAWAL"
        ].includes(data.status)
      ) {
        this.doRefreshGrid = true;
      }
    }
  }
};
</script>
