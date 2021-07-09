<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("bank-filter") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("bank_transactions_subtitle") }}
                </div></v-col
              >
            </v-row>
          </template>

          <div style="height: 300px">
            <ag-grid-vue
              style="height: 100%"
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
              @selection-changed="onSelectionChanged"
            />
          </div>
          <div class="mt-5 py-0">
            <validation-observer ref="observer">
              <v-form
                class="text-left"
                style="display: inline-block"
                @submit.prevent="onFilterSubmit"
              >
                <DepositWithdrawTypeDropdown
                  v-model="filterType"
                  style="display: inline-block; width: 200px"
                  is-bank
                />
                <v-text-field
                  v-model="filterBankNo"
                  class="ml-2"
                  style="display: inline-block; width: 200px"
                  :name="$t('bank_no')"
                  :label="$t('bank_no')"
                ></v-text-field>
                <v-btn
                  type="submit"
                  :loading="fetching"
                  :disabled="fetching"
                  color="green"
                >
                  submit
                </v-btn>
              </v-form>
            </validation-observer>
            <div
              class="float-right pt-5"
              style="display: inline-block; vertical-align: middle"
            >
              <span v-if="companyBank.lastCrewlerAt" class="mr-5">{{
                $t("last_updated_at", [
                  $Moment(companyBank.lastCrewlerAt).format("L HH:mm:ss")
                ])
              }}</span>
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
          </div>
          <!-- <div class="mt-5" style="height: 1000px">
            <ag-grid-vue
              style="height: 100%"
              class="ag-theme-alpine"
              row-model-type="infinite"
              :column-defs="columnDefs2"
              :default-col-def="{
                sortable: true,
                resizable: true
              }"
              :animate-rows="true"
              :suppress-drag-leave-hides-columns="true"
              :row-drag-managed="false"
              :floating-filter="false"
              @grid-ready="onGridReady2"
            />
          </div> -->
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";
import { getCompanyBankAccounts } from "@/api/companyBankAccount.js";
import { getCompanyBankAccountRawTransaction } from "@/api/companyBankAccountRawTransaction.js";

import DepositWithdrawTypeDropdown from "@/components/DepositWithdrawTypeDropdown";

import BankType from "@/views/finance/grid/BankType";
import Status from "@/views/finance/grid/Status";
import TransactionType from "@/views/transaction/grid/TransactionType";

import { columnDefs } from "@/views/finance/grid/CompanyBankColumnDefs.js";
Object.freeze(columnDefs);
import { columnDefs as columnDefs2 } from "@/views/finance/grid/CompanyBankTranscationColumnDefs.js";
Object.freeze(columnDefs2);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "List",
  components: {
    AgGridVue,
    DepositWithdrawTypeDropdown,
    /* eslint-disable */
    AgGridHeaderI18n,
    BankType,
    Status,
    TransactionType
  },
  data: () => ({
    columnDefs,
    columnDefs2,
    rowData: [],
    rowData2: [],
    gridApi: null,
    columnApi: null,
    gridApi2: null,
    columnApi2: null,

    companyBank: {},
    filterType: ["DEPOSIT", "WITHDRAWAL"],
    filterBankNo: null
  }),
  computed: {
    locale: get("global/locale")
  },
  created() {
    this.fetchBanks();
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

      this.onLocaleChanged(this.locale);
    },
    onGridReady2(params) {
      this.gridApi2 = params.api;
      this.columnApi2 = params.columnApi;

      // default sort
      this.columnApi2.getColumn("no").setSort("desc");

      this.gridApi2.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi2.showLoadingOverlay();

          if (!this.currentBank) {
            params.successCallback([], 0);
            this.gridApi2.hideOverlay();
            return;
          }

          getCompanyBankAccountRawTransaction(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            "&companyBank.no=" + this.currentBank.accountCode
          )
            .then(data => {
              if (params.startRow === 0 && data.companyBank) {
                this.companyBank = data.companyBank;
              }
              let lastRow = -1;
              if (data.items.length < params.endRow - params.startRow) {
                lastRow =
                  params.endRow -
                  (params.endRow - params.startRow - data.items.length);
              }
              params.successCallback(data.items, lastRow);
              this.gridApi2.hideOverlay();
            })
            .catch(error => {
              this.gridApi2.hideOverlay();
            });
        }
      });
    },
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows()[0];
      this.currentBank = selectedRows;
      this.onRefreshClicked();
    },
    fetchBanks() {
      const req = "?status_eq=APPROVED";
      getCompanyBankAccounts(req).then(res => {
        this.rowData = res;
      });
    },
    onRefreshClicked() {
      this.gridApi2.purgeInfiniteCache();
      this.gridApi2.setInfiniteRowCount(0);
    },
    async onFilterSubmit() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }
      let filter = this.gridApi2.getFilterModel();
      if (!filter) {
        filter = {};
      }
      if (this.filterType) {
        filter["type"] = {
          type: "equals",
          filter: this.filterType.join(",")
        };
      } else {
        if (filter["type"]) {
          delete filter["type"];
        }
      }
      if (this.filterBankNo) {
        filter["from"] = {
          type: "contains",
          filter: this.filterBankNo
        };
      } else {
        if (filter["from"]) {
          delete filter["from"];
        }
      }
      // this.gridApi2.purgeInfiniteCache();
      this.gridApi2.setInfiniteRowCount(0);
      this.gridApi2.setFilterModel(filter);
    }
  }
};
</script>
