<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("bank-summary") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("bank_summary_subtitle") }}
                </div></v-col
              >
              <v-col class="py-0 text-right">
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
              </v-col>
            </v-row>
          </template>

          <div style="height: 76vh;">
            <ag-grid-vue
              :style="showFrom ? 'height: 48%;' : 'height: 100%;'"
              class="ag-theme-alpine pt-2"
              row-selection="single"
              :column-defs="columnDefs"
              :default-col-def="{
                sortable: true,
                resizable: true
              }"
              :row-data="rowData"
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
import { getCompanyBankAccounts } from "@/api/companyBankAccount.js";

import BankType from "@/views/finance/grid/BankType";
import Status from "@/views/finance/grid/Status";

import { columnDefs } from "@/views/finance/grid/SummaryCompanyBankColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "List",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    BankType,
    Status
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    fetching: false
  }),
  created() {
    this.fetchCompanyBankAccounts();
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged(locale) {
      if (locale === "th") {
        this.columnApi.setColumnsVisible(["bank.thaiName"], true);
        this.columnApi.setColumnsVisible(["bank.name"], false);
      } else {
        this.columnApi.setColumnsVisible(["bank.thaiName"], false);
        this.columnApi.setColumnsVisible(["bank.name"], true);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.onLocaleChanged();
    },
    fetchCompanyBankAccounts() {
      this.fetching = true;
      const req = "?status_ne=DELETED";
      getCompanyBankAccounts(req).then(res => {
        this.rowData = res;
        this.fetching = false;
      });
    },
    onRefreshClicked() {
      this.fetchCompanyBankAccounts();
    }
  }
};
</script>
