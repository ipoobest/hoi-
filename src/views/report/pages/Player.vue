<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("player-report") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("player_report_subtitle") }}
            </div>
          </template>

          <validation-observer ref="observer">
            <v-form @submit.prevent="onSubmit">
              <v-container>
                <v-row>
                  <v-col class="py-0">
                    <v-radio-group
                      v-model="filterOption"
                      row
                      class="pa-0 ma-0"
                      hide-details
                    >
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
                      <span class="mx-2 my-auto">{{ $t("username") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterUsername"
                          :label="$t('username')"
                          type="text"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{ $t("phone") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterPhone"
                          :label="$t('phone')"
                          type="text"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{
                        $t("parent_member")
                      }}</span>
                      <div>
                        <v-text-field
                          v-model="filterParentUsername"
                          :label="$t('parent_member')"
                          type="text"
                        />
                      </div>
                      <v-btn type="submit" color="success" class="mx-2 my-auto">
                        <strong>{{ $t("search2") }}</strong>
                      </v-btn>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <span
                  class="pr-2 my-auto"
                  style="font-size: 16px; color: #000000;"
                  >{{ $t("player_list") }}</span
                >
                <ag-grid-vue
                  style="height: 65vh;"
                  class="ag-theme-alpine"
                  row-selection="single"
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
                  :framework-components="frameworkComponents"
                  @grid-ready="onGridReady"
                  @cell-focused="onCellFocused"
                />
              </v-container>
            </v-form>
          </validation-observer>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";

import { getPlayerOrderLottoTable, getSumOrders } from "@/api/orderLotto";

import PlayerMemberId from "@/views/report/grid/PlayerMemberId";
import PlayerParentId from "@/views/report/grid/PlayerParentId";
import { columnDefs } from "@/views/report/grid/PlayerColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "ReportPlayer",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    PlayerMemberId,
    PlayerParentId
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,
    currentOrder: "",
    pinnedBottomRow: [],
    frameworkComponents: null,

    filterUsername: null,
    filterPhone: null,
    filterEmail: null,
    filterParentUsername: null,

    filterDatesModal: false,
    filterDates: null
  }),
  computed: {
    dateRangeText() {
      return this.filterDates.join(" ~ ");
    }
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.filterDates = [this.$Moment().format("YYYY-MM-DD")];

    this.$EventBus.$on("onBetRefresh", this.onBetRefresh);
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onBetRefresh", this.onBetRefresh);
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.pinnedBottomRow = [
        {
          username: this.$t("summary"),
          totalAmount: 0,
          totalDiscount: 0,
          totalReward: 0,
          totalProfit: 0
        }
      ];
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            username: this.$t("summary"),
            totalAmount: this.summary.totalAmount,
            totalDiscount: this.summary.totalDiscount,
            totalReward: this.summary.totalReward,
            totalProfit: this.summary.totalProfit
          }
        ];
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default sort
      this.columnApi.getColumn("username").setSort("asc");

      this.summary = null;
      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          let startedAt = this.$Moment(this.filterDates[0], "YYYY-MM-DD")
            .startOf("day")
            .format();
          let endedAt = this.$Moment(this.filterDates[0], "YYYY-MM-DD")
            .endOf("day")
            .format();
          if (this.filterDates.length === 2) {
            endedAt = this.$Moment(this.filterDates[1], "YYYY-MM-DD")
              .endOf("day")
              .format();
          }
          startedAt = encodeURIComponent(startedAt);
          endedAt = encodeURIComponent(endedAt);
          getPlayerOrderLottoTable(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            `&createdAt_gte=${startedAt}&createdAt_lte=${endedAt}&status=FINISHED`
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

          getSumOrders(
            params.filterModel,
            `&createdAt_gte=${startedAt}&createdAt_lte=${endedAt}&status=FINISHED`
          )
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
    onCellFocused(event) {
      if (this.gridApi) {
        this.gridApi.forEachNode(node => {
          if (event.rowIndex === node.rowIndex) {
            this.currentOrder = node.data;
            return;
          }
        });
      }
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
      if (this.filterPhone) {
        filter["phone"] = {
          type: "contains",
          filter: this.filterPhone
        };
      } else {
        if (filter["phone"]) {
          delete filter["phone"];
        }
      }
      if (this.filterParentUsername) {
        filter["parentUsername"] = {
          type: "contains",
          filter: this.filterParentUsername
        };
      } else {
        if (filter["parentUsername"]) {
          delete filter["parentUsername"];
        }
      }

      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    },
    onBetRefresh() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
    },
    onFilterDatesChange(filterDates) {
      const newFilterDates = this.$_.sortBy(filterDates);
      this.filterDates = newFilterDates;
      this.$refs.filterDatesDialog.save(newFilterDates);
    }
  }
};
</script>

<style>
.filter-dates .v-text-field {
  width: 250px;
}

.info-score {
  background-color: rgba(179, 212, 255, 0.4);
}
.good-score {
  background-color: rgba(185, 246, 202, 0.4);
}

.bad-score {
  background-color: rgba(255, 128, 171, 0.4);
}
</style>
