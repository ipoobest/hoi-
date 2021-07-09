<template>
  <v-container fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("winloss_report") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("winloss_report_subtitle") }}
            </div>
          </template>

          <div style="margin-top: 1rem; min-height: 700px; height: auto;">
            <v-row class="pl-5 pr-5">
              <v-col>
                <div style="width: 250px; display: inline-block;">
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
                <v-btn
                  type="submit"
                  color="success"
                  class="mx-2 my-auto"
                  :loading="fetching"
                  @click="loadData"
                >
                  <strong>{{ $t("search2") }}</strong>
                </v-btn>
              </v-col>
            </v-row>
            <ag-grid-vue
              class="ag-theme-alpine"
              :row-height="50"
              :default-col-def="defaultColDef"
              :row-data="rowData"
              :column-defs="columnDefs"
              :animate-rows="true"
              :suppress-drag-leave-hides-columns="true"
              :row-drag-managed="false"
              :floating-filter="false"
              :pinned-bottom-row-data="pinnedBottomRow"
              :framework-components="frameworkComponents"
              @grid-ready="onGridReady"
            />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";

import { getWinLoss } from "@/api/winLoss";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";

import { columnDefs } from "@/views/report/grid/OverAllColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "Overall",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n
  },
  data: () => ({
    columnDefs,
    defaultColDef: {
      sortable: false,
      resizable: true,
      filter: false
    },
    rowData: [],
    pinnedBottomRow: [],
    filterDatesModal: false,
    filterDates: [],
    locale: null,
    fetching: false
  }),
  computed: {
    dateRangeText() {
      return this.filterDates.join(" - ");
    },
    locale: get("global/locale")
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);

    this.locale = this.$i18n.locale;
    this.filterDates = [this.$Moment().format("YYYY-MM-DD")];
    this.loadData();
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged(locale) {
      this.locale = locale;
      if (locale === "th") {
        this.columnApi.setColumnsVisible(["productLottoThaiName"], true);
        this.columnApi.setColumnsVisible(["productLottoName"], false);
      } else {
        this.columnApi.setColumnsVisible(["productLottoThaiName"], false);
        this.columnApi.setColumnsVisible(["productLottoName"], true);
      }

      this.setGridPinedRow();
    },
    setGridPinedRow() {
      this.pinnedBottomRow = [
        {
          code: this.$t("summary"),
          totalAmount: 0,
          totalDiscount: 0,
          totalReward: 0,
          totalNet: 0
        }
      ];
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            code: this.$t("summary"),
            totalAmount: this.summary.totalAmount,
            totalAffiliate: this.summary.totalAffiliate,
            totalReward: this.summary.totalReward,
            totalNet: this.summary.totalNet,
            totalProfit: this.summary.totalProfit
          }
        ];
      }
    },
    onMenuClicked(page) {
      this.$router.replace(`/total/lotto/${page}/${this.$route.params.id}`);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      params.api.setGridAutoHeight(true);

      // default lang
      this.onLocaleChanged(this.locale);
    },
    loadData() {
      this.fetching = true;
      let startedAt = this.$Moment(this.filterDates[0], "YYYY-MM-DD")
        .startOf("day")
        .format("YYYY-MM-DD");
      let endedAt = this.$Moment(this.filterDates[0], "YYYY-MM-DD")
        .endOf("day")
        .format("YYYY-MM-DD");
      if (this.filterDates.length === 2) {
        endedAt = this.$Moment(this.filterDates[1], "YYYY-MM-DD")
          .endOf("day")
          .format("YYYY-MM-DD");
      }
      startedAt = encodeURIComponent(startedAt);
      endedAt = encodeURIComponent(endedAt);
      getWinLoss(
        `?_sort=order:ASC,productLottoCode:ASC&resultedAt_gte=${startedAt}&resultedAt_lte=${endedAt}`
      ).then(res => {
        let totalAmount = 0;
        let totalAffiliate = 0;
        let totalReward = 0;
        let totalNet = 0;
        let totalProfit = 0;
        this.rowData = this.$_.map(res, r => {
          totalAmount += r.totalAmount;
          totalAffiliate += r.totalAffiliate;
          totalReward += r.totalReward;
          totalNet += r.totalNet;
          totalProfit += r.totalProfit;
          return r;
        });
        this.summary = {
          totalAmount,
          totalAffiliate,
          totalReward,
          totalNet,
          totalProfit
        };
        this.setGridPinedRow();
        this.fetching = false;
      });
    },
    onFilterDatesChange(filterDates) {
      const newFilterDates = this.$_.sortBy(filterDates);
      this.filterDates = newFilterDates;
      this.$refs.filterDatesDialog.save(newFilterDates);
    }
  }
};
</script>
