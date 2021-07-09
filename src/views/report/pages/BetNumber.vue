<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              สินค้า
            </div>

            <div class="subtitle-1 font-weight-light">
              รายการเดิมพันทั้งหมด
            </div>
          </template>

          <validation-observer ref="observer">
            <v-form @submit.prevent="onSubmit">
              <v-container>
                <v-row>
                  <v-radio-group
                    v-model="filterOption"
                    row
                    class="pa-0 ma-0 pl-3 filter-dates"
                    hide-details
                  >
                    <span class="pr-2 my-auto">ค้นหาตาม</span>
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
                          label="วันที่"
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
                        locale="th-TH"
                        :max="$Moment().format('YYYY-MM-DD')"
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="filterDatesModal = false"
                          >ยกเลิก</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="onFilterDatesChange(filterDates)"
                          >ตกลง</v-btn
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
                      <span class="mx-2 my-auto">ประเภทสินค้า</span>
                      <div>
                        <v-text-field
                          v-model="filterType"
                          label="กรอกประเภทสินค้า"
                          type="text"
                        />
                      </div>
                      <span class="mx-2 my-auto">สินค้า</span>
                      <div>
                        <v-text-field
                          v-model="filterLottoName"
                          label="กรอกสินค้า"
                          type="text"
                        />
                      </div>
                      <v-btn type="submit" color="success" class="mx-2 my-auto">
                        <strong>ค้นหา</strong>
                      </v-btn>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <span
                  class="pr-2 my-auto"
                  style="font-size: 16px; color: #000000;"
                  >รายการสินค้าทั้งหมด</span
                >
                <ag-grid-vue
                  style="height: 300px;"
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
                <br />
                <OrderItemGroupTable :current-order="currentOrder" />
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
import OrderItemGroupTable from "@/views/report/components/OrderItemGroupTable";
import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";

import { getLottoTable, getSumLottos } from "@/api/lotto";

import MemberId from "@/views/report/grid/MemberId";
import { columnDefs } from "@/views/report/grid/LottoColumnDefs.js";
Object.freeze(columnDefs);

export default {
  name: "ReportBetNumber",
  components: {
    AgGridVue,
    OrderItemGroupTable,
    /* eslint-disable */
    MemberId
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,
    currentOrder: "",
    pinnedBottomRow: [],
    frameworkComponents: null,

    filterDatesModal: false,
    filterDates: [],
    filterType: null,
    filterLottoName: null
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
    this.$EventBus.$on("onBetRefresh", this.onBetRefresh);

    this.filterDates = [
      this.$Moment().startOf("month").format("YYYY-MM-DD"),
      this.$Moment().format("YYYY-MM-DD")
    ];
  },
  beforeDestroy() {
    this.$EventBus.$off("onBetRefresh", this.onBetRefresh);
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default sort
      this.columnApi.getColumn("resultedAt").setSort("desc");

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
        }
      });

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getLottoTable(
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

          getSumLottos(params.filterModel)
            .then(res => {
              this.pinnedBottomRow = [
                {
                  _id: "รวม",
                  totalAmount: res.totalAmount,
                  totalDiscount: res.totalDiscount,
                  totalNet: res.totalNet,
                  totalReward: res.totalReward,
                  totalProfit: res.totalProfit
                }
              ];
            })
            .catch(err => {
              this.pinnedBottomRow = [
                {
                  _id: "รวม",
                  totalAmount: 0,
                  totalDiscount: 0,
                  totalNet: 0,
                  totalReward: 0,
                  totalProfit: 0
                }
              ];
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
      if (this.filterType) {
        let type = this.filterType;
        if (type === "หวย") {
          type = "LOTTO";
        } else if (type === "ยี่กี") {
          type = "YEEKEE";
        }
        filter["type"] = {
          type: "contains",
          filter: type
        };
      } else {
        if (filter["type"]) {
          delete filter["type"];
        }
      }
      if (this.filterLottoName) {
        filter["thaiName"] = {
          type: "contains",
          filter: this.filterLottoName
        };
      } else {
        if (filter["thaiName"]) {
          delete filter["thaiName"];
        }
      }

      // this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    },
    onBetRefresh() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
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
