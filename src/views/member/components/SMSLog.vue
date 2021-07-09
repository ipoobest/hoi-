<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
          <validation-observer ref="observer">
            <form @submit.prevent="onSubmit">
              <v-container class="pa-0">
                <v-row>
                  <v-radio-group
                    v-model="filterOption"
                    row
                    class="pa-0 ma-0 pl-5 filter-dates"
                    hide-details
                  >
                    <span class="pr-2 my-auto">{{ $t("filter_by") }}</span>
                    <v-dialog
                      ref="filterDatesDialog"
                      v-model="filterDatesModal"
                      :return-value.sync="filterDates"
                      persistent
                      width="290px"
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
                        :max="$Moment().format('YYYY-MM-DD')"
                      >
                        <v-spacer></v-spacer>
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
                  </v-radio-group>
                </v-row>
                <v-row>
                  <v-col class="py-0">
                    <v-radio-group
                      v-model="filterOption"
                      row
                      class="pa-0 ma-0"
                      hide-details
                    >
                      <span class="mx-2 my-auto">{{ $t("sender-name") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterUsername"
                          :label="$t('sender-name')"
                          type="text"
                        />
                      </div>
                      <span class="pr-2 my-auto">{{ $t("status") }}</span>
                      <div>
                        <SMSTransactionTypeDropdownWithValidation
                          v-model="filterType"
                          vid="type"
                          :name="$t('status')"
                          :label="$t('status')"
                          rules="required"
                          :default-items="[
                            'AUTO',
                            'SINGLE',
                            'MANY',
                            'FORGET_PASSWORD',
                            'PHONE_VERIFY',
                            'CHANGE_PHONE'
                          ]"
                        />
                      </div>
                      <v-btn type="submit" color="success" class="mx-2 my-auto">
                        <strong>{{ $t("search2") }}</strong>
                      </v-btn>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <div style="height: 60vh">
                  <ag-grid-vue
                    style="height: 100%"
                    class="ag-theme-alpine"
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
                    :pinned-bottom-row-data="pinnedBottomRow"
                    @grid-ready="onGridReady"
                  />
                </div>
              </v-container>
            </form>
          </validation-observer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";
import { withValidation } from "vee-validate";
import {
  getSMSTransactions,
  getSumSMSTransactions
} from "@/api/sms";
import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import SMSTransactionTypeDropdown from "@/components/SMSTransactionTypeDropdown";

import SmsType from "@/views/sms/grid/SmsType";

const SMSTransactionTypeDropdownWithValidation = withValidation(
  SMSTransactionTypeDropdown
);

import { columnDefs } from "@/views/sms/grid/SMSLogsColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "SMSLog",
  components: {
    AgGridVue,
    SMSTransactionTypeDropdownWithValidation,
    /* eslint-disable */
    AgGridHeaderI18n,
    SmsType
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    filterDatesModal: false,
    filterDates: [],
    filterUsername: null,
    filterType: [
      "AUTO",
      "SINGLE",
      "MANY",
      "FORGET_PASSWORD",
      "PHONE_VERIFY",
      "CHANGE_PHONE"
    ],
    pinnedBottomRow: []
  }),
  computed: {
    locale: get("global/locale"),
    dateRangeText() {
      return this.filterDates.join(" ~ ");
    }
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };

    this.filterDates = [
      this.$Moment().startOf("month").format("YYYY-MM-DD"),
      this.$Moment().format("YYYY-MM-DD")
    ];

    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.pinnedBottomRow = [
        {
          senderName: this.$t("summary"),
          qty: 0,
          amount: 0,
          createdAt: "",
          sendSuccess: ""
        }
      ];
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            senderName: this.$t("summary"),
            qty: this.summary.totalQty,
            amount: this.summary.totalAmount,
            createdAt: "",
            sendSuccess: ""
          }
        ];
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default sort
      this.columnApi.getColumn("createdAt").setSort("desc");

      // default filter
      this.gridApi.setFilterModel({
        createdAt: {
          type: "equals",
          filter:
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
              .format()
        },
        type: {
          type: "contains",
          filter: this.filterType.join(",")
        }
      });

      this.summary = null;
      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getSMSTransactions(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel
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

          // getSumSMSTransactions(params.filterModel, "sendSuccess_eq=true")
          getSumSMSTransactions(params.filterModel)
            .then(res => {
              this.summary = res;
              this.onLocaleChanged();
            })
            .catch(err => {
              this.onLocaleChanged();
            });
        }
      });
    },
    onFilterDatesChange(filterDates) {
      const newFilterDates = this.$_.sortBy(filterDates);
      this.filterDates = newFilterDates;
      this.$refs.filterDatesDialog.save(newFilterDates);
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
      if (this.filterDates.length > 0) {
        filter["createdAt"] = {
          type: "equals",
          filter:
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
              .format()
        };
      } else {
        if (filter.createdAt) {
          delete filter.createdAt;
        }
      }
      if (this.filterUsername) {
        filter["senderName"] = {
          type: "contains",
          filter: this.filterUsername
        };
      } else {
        if (filter["senderName"]) {
          delete filter["senderName"];
        }
      }
      if (this.filterType) {
        filter["type"] = {
          type: "contains",
          filter: this.filterType.join(",")
        };
      } else {
        if (filter["type"]) {
          delete filter["type"];
        }
      }

      // this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    }
  }
};
</script>

<style>
.filter-dates .v-text-field {
  width: 250px;
}
</style>
