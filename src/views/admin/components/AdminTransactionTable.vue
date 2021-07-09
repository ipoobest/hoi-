<template>
  <div class="pt-2">
    <v-card class="my-0">
      <v-card-title class="subheading font-weight-bold">
        <v-icon left color="success">mdi-bank-transfer</v-icon
        >{{ $t("admin_transaction") }}</v-card-title
      >
      <validation-observer ref="observer">
        <form class="mt-3" @submit.prevent="onSubmit">
          <v-container class="pa-0">
            <v-row>
              <v-col class="py-0">
                <v-radio-group
                  v-model="filterOption"
                  row
                  class="pa-0 ma-0"
                  hide-details
                >
                  <span class="pr-2 my-auto">{{ $t("filter_by") }}</span>
                  <div style="width: 700px">
                    <DepositWithdrawStatusDropdownWithValidation
                      v-model="filterStatus"
                      vid="status"
                      :label="$t('status')"
                      :name="$t('status')"
                      rules="required"
                    />
                  </div>
                  <span class="pr-2 my-auto">{{ $t("type") }}</span>
                  <div style="width: 280px">
                    <DepositWithdrawTypeDropdownWithValidation
                      v-model="filterType"
                      :label="$t('type')"
                      vid="type"
                      :name="$t('type')"
                      rules="required"
                    />
                  </div>
                  <span class="mx-2 my-auto">{{ $t("username") }}</span>
                  <div>
                    <v-text-field
                      v-model="filterUsername"
                      :label="$t('username_placeholder')"
                      type="text"
                    />
                  </div>
                  <div style="width: 250px; display: inline-block">
                    <v-dialog
                      ref="filterDatesDialog"
                      v-model="filterDatesModal"
                      :return-value.sync="filterDates"
                      persistent
                      width="320px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateRangeText"
                          :label="$t('date')"
                          prepend-icon="event"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="filterDates"
                        scrollable
                        range
                        :locale="locale"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="grey" @click="onFilterDatesReset">{{
                          $t("clear")
                        }}</v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="filterDatesModal = false"
                          >{{ $t("cancel") }}</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="onFilterDatesChange(filterDates)"
                          >{{ $t("ok") }}</v-btn
                        >
                      </v-date-picker>
                    </v-dialog>
                  </div>
                  <v-btn type="submit" color="success" class="mx-2 my-auto">
                    <strong>{{ $t("search2") }}</strong>
                  </v-btn>
                </v-radio-group>
              </v-col>
            </v-row>
            <div style="margin-top: 1rem; height: 69vh">
              <ag-grid-vue
                style="height: 100%"
                class="ag-theme-alpine"
                row-selection="single"
                row-model-type="infinite"
                :column-defs="columnDefs"
                :default-col-def="{
                  resizable: true,
                  sortable: true
                }"
                :animate-rows="true"
                :suppress-drag-leave-hides-columns="true"
                :row-drag-managed="false"
                :floating-filter="false"
                @grid-ready="onGridReady"
              />
            </div>
          </v-container>
        </form>
      </validation-observer>
    </v-card>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { withValidation } from "vee-validate";
import { getPayment } from "@/api/payment.js";

import DepositWithdrawStatusDropdown from "@/components/DepositWithdrawStatusDropdown";
import DepositWithdrawTypeDropdown from "@/components/DepositWithdrawTypeDropdown";
const DepositWithdrawStatusDropdownWithValidation = withValidation(
  DepositWithdrawStatusDropdown
);
const DepositWithdrawTypeDropdownWithValidation = withValidation(
  DepositWithdrawTypeDropdown
);

import TransactionId from "@/views/transaction/grid/TransactionId";
import TransactionType from "@/views/transaction/grid/TransactionType";
import MemberId from "@/views/admin/grid/MemberId";
import Status from "@/views/transaction/grid/Status";

import { columnDefs } from "@/views/admin/grid/AdminTransactionColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  components: {
    AgGridVue,
    DepositWithdrawStatusDropdownWithValidation,
    DepositWithdrawTypeDropdownWithValidation,
    /* eslint-disable */
    AgGridHeaderI18n,
    TransactionId,
    TransactionType,
    MemberId,
    Status
  },
  props: {
    userId: {
      type: String,
      default: ""
    },
    createdAt: {
      type: String,
      default: ""
    },
    transactionId: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    filterStatus: null,
    filterType: null,
    filterUsername: null,

    filterDatesModal: false,
    filterDates: []
  }),
  computed: {
    dateRangeText() {
      return this.filterDates.join(" - ");
    }
  },
  watch: {
    transactionId(transactionId) {
      if (transactionId) {
        this.gridApi.purgeInfiniteCache();
        this.gridApi.setInfiniteRowCount(0);
        // this.gridApi.refreshInfiniteCache();
      }
    }
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default sort
      this.columnApi.getColumn("_id").setSort("desc");

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();
          const req = `&adminId=${this.userId}`;
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
              this.gridApi.hideOverlay();
            })
            .catch(error => {
              this.gridApi.hideOverlay();
            });
        }
      });
    },
    async onSubmit() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }
      let filter = this.gridApi.getFilterModel();
      if (!filter) {
        filter = {};
      }
      if (this.filterStatus.length > 0) {
        filter["status"] = {
          type: "contains",
          filter: this.filterStatus.join(",")
        };
      } else {
        if (filter.status) {
          delete filter.status;
        }
      }
      if (this.filterType.length > 0) {
        filter["type"] = {
          type: "contains",
          filter: this.filterType.join(",")
        };
      } else {
        if (filter.type) {
          delete filter.type;
        }
      }
      if (this.filterUsername) {
        filter["username"] = {
          type: "contains",
          filter: this.filterUsername
        };
      } else {
        if (filter["username"]) {
          delete filter["username"];
        }
      }
      if (this.filterDates.length > 0) {
        let filterValue = "";
        if (this.filterDates.length === 2) {
          filterValue +=
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0)
              .format() +
            "," +
            this.$Moment(this.filterDates[1], "YYYY-MM-DD")
              .hours(23)
              .minutes(59)
              .seconds(59)
              .milliseconds(999)
              .format();
        } else {
          filterValue =
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0)
              .format() +
            "," +
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(23)
              .minutes(59)
              .seconds(59)
              .milliseconds(999)
              .format();
        }
        filter["createdAt"] = {
          type: "equals",
          filter: filterValue
        };
      } else {
        if (filter.createdAt) {
          delete filter.createdAt;
        }
      }

      // this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
      // this.gridApi.onFilterChanged();
    },
    onFilterDatesReset() {
      this.filterDatesModal = false;
      this.filterDates = [];
      this.$refs.filterDatesDialog.save([]);
    },
    onFilterDatesChange(filterDates) {
      const newFilterDates = this.$_.sortBy(filterDates);
      this.filterDates = newFilterDates;
      this.$refs.filterDatesDialog.save(newFilterDates);
    }
  }
};
</script>
