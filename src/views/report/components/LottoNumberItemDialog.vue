<template>
  <v-dialog
    v-if="item"
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t("order_items") }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5" outlined tile>
              <span class="text-h2">{{ $t("number") }}</span>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span class="text-h2 font-weight-bold">{{ displayNumber }}</span>
            </v-card>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5" outlined tile>
              <span class="text-h2">{{ $t("type") }}</span>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span v-if="item.type" class="text-h2 font-weight-bold">{{
                $t(item.type.toLowerCase())
              }}</span>
            </v-card>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5" outlined tile>
              <span class="text-h2">{{ $t("orders") }}</span>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span v-if="summaryOrder" class="text-h2 font-weight-bold">{{
                $Numeral(summaryOrder.totalOrders).format("0,0")
              }}</span>
            </v-card>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5" outlined tile>
              <span class="text-h2">{{ $t("items") }}</span>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span
                v-if="item.totalOrderItems"
                class="text-h2 font-weight-bold"
                >{{ $Numeral(item.totalOrderItems).format("0,0") }}</span
              >
            </v-card>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5 red accent-1" outlined tile>
              <span class="text-h2"
                >{{ $t("orders") }} ({{ $t("cancelled") }})</span
              >
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span
                v-if="summaryOrder2"
                class="text-h2 font-weight-bold red--text"
                >{{ $Numeral(summaryOrder2.totalOrders).format("0,0") }}</span
              >
            </v-card>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5 red accent-1" outlined tile>
              <span class="text-h2"
                >{{ $t("items") }} ({{ $t("cancelled") }})</span
              >
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span
                v-if="summary2"
                class="text-h2 font-weight-bold red--text"
                >{{ $Numeral(summary2.totalOrderItems).format("0,0") }}</span
              >
            </v-card>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5" outlined tile>
              <span class="text-h2">{{ $t("bet_amount") }}</span>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span v-if="summary" class="text-h2 font-weight-bold">{{
                $Numeral(summary.totalAmount).format("0,0.00")
              }}</span>
            </v-card>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5" outlined tile>
              <span class="text-h2">{{ $t("prize") }}</span>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span v-if="summary" class="text-h2 font-weight-bold">{{
                $Numeral(summary.totalReward).format("0,0.00")
              }}</span>
            </v-card>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-card class="pa-5 red accent-1" outlined tile>
              <span class="text-h2"
                >{{ $t("bet_amount") }} ({{ $t("cancelled") }})</span
              >
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-5" outlined tile>
              <span
                v-if="summary2"
                class="text-h2 font-weight-bold red--text"
                >{{ $Numeral(summary2.totalAmount).format("0,0.00") }}</span
              >
            </v-card>
          </v-col>
        </v-row>
        <br />
        <v-tabs v-model="tab" :color="tabColor" grow @change="onTabChange">
          <v-tab v-for="tab in tabItems" :key="tab" :active-class="tab.class">
            {{ $t(tab.text) }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="tab in tabItems" :key="tab">
            <v-card flat>
              <v-card-text v-if="tab.text === 'outstanding_balance'"
                ><ag-grid-vue
                  style="height: 650px"
                  class="ag-theme-alpine"
                  :default-col-def="defaultColDef"
                  :column-defs="columnDefs"
                  row-model-type="infinite"
                  :animate-rows="true"
                  :suppress-drag-leave-hides-columns="true"
                  :row-drag-managed="false"
                  :floating-filter="false"
                  :pinned-bottom-row-data="pinnedBottomRow"
                  :framework-components="frameworkComponents"
                  @grid-ready="onGridReady"
              /></v-card-text>
              <v-card-text v-else-if="tab.text === 'cancel_orders_amount'"
                ><ag-grid-vue
                  style="height: 650px"
                  class="ag-theme-alpine"
                  :default-col-def="defaultColDef"
                  :column-defs="columnDefs"
                  row-model-type="infinite"
                  :animate-rows="true"
                  :suppress-drag-leave-hides-columns="true"
                  :row-drag-managed="false"
                  :floating-filter="false"
                  :pinned-bottom-row-data="pinnedBottomRow2"
                  :framework-components="frameworkComponents"
                  @grid-ready="onGridReady2"
              /></v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
    <LottoNumberItemBottomSheet
      v-model="bottomSheet"
      :order-lotto-id="bottomSheetOrderLottoId"
    />
  </v-dialog>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { columnDefs } from "@/views/report/grid/LottoNumberItemColumnDefs";

import {
  getLottoNumberItems,
  getSumLottoNumberItems,
  getSumOrderLottoNumberItems,
  getLottoToodNumberItems,
  getSumLottoToodNumberItems,
  getSumOrderLottoToodNumberItems
} from "@/api/orderLottoItem";
import { extractNumberToTood } from "@/utils/LottoTypeFormatter";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";
import PlayerMemberId from "@/views/report/grid/PlayerMemberId";
import PlayerParentId from "@/views/report/grid/PlayerParentId";
import BillNo from "@/views/report/grid/BillNo";

import LottoNumberItemBottomSheet from "@/views/report/components/LottoNumberItemBottomSheet";
export default {
  components: {
    AgGridVue,
    LottoNumberItemBottomSheet,
    /* eslint-disable */
    AgGridHeaderI18n,
    PlayerMemberId,
    PlayerParentId,
    BillNo
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    columnDefs,
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: false
    },
    pinnedBottomRow: [],
    pinnedBottomRow2: [],
    dialog: false,
    tab: null,
    tabItems: [
      {
        text: "outstanding_balance",
        class: "green--text"
      },
      {
        text: "cancel_orders_amount",
        class: "red--text"
      }
    ],
    tabColor: "green",
    bottomSheet: false,
    bottomSheetOrderLottoId: null,
    summary2: {
      totalAmount: 0,
      totalReward: 0,
      totalOrderItems: 0,
      totalPay: 0
    },
    summaryOrder: {
      totalOrders: 0
    },
    summaryOrder2: {
      totalOrders: 0
    }
  }),
  computed: {
    displayNumber: function () {
      if (this.item.type.startsWith("TOOD")) {
        const toodArr = extractNumberToTood(this.item.number);
        return toodArr.join(", ");
      } else {
        return this.item.number;
      }
    }
  },
  watch: {
    value(value) {
      this.dialog = value;
    },
    dialog(value) {
      this.$emit("input", value);
    },
    item(value) {
      this.loadData();
      if (this.gridApi) {
        this.gridApi.deselectAll();
        this.gridApi.purgeInfiniteCache();
        this.gridApi.setInfiniteRowCount(0);
      }

      if (this.gridApi2) {
        this.gridApi2.deselectAll();
        this.gridApi2.purgeInfiniteCache();
        this.gridApi2.setInfiniteRowCount(0);
      }
    }
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
    this.$EventBus.$on(
      "onLottoNumberItemBottomSheet",
      this.onLottoNumberItemBottomSheet
    );
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
    this.$EventBus.$off(
      "onLottoNumberItemBottomSheet",
      this.onLottoNumberItemBottomSheet
    );
  },
  methods: {
    onLottoNumberItemBottomSheet(orderLottoId) {
      this.bottomSheetOrderLottoId = orderLottoId;
      this.bottomSheet = true;
    },
    onTabChange(tabIndex) {
      if (tabIndex === 0) {
        this.tabColor = "green";
      } else if (tabIndex === 1) {
        this.tabColor = "red";
      }
    },
    onLocaleChanged() {
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            no: this.$t("summary"),
            price: this.summary.totalAmount,
            reward: this.summary.totalReward
          }
        ];
      }
      if (this.gridApi) {
        this.$nextTick(() => {
          this.gridApi.sizeColumnsToFit();
        });
      }
    },
    onLocaleChanged2() {
      if (this.summary2) {
        this.pinnedBottomRow2 = [
          {
            no: this.$t("summary"),
            price: this.summary2.totalAmount,
            reward: this.summary2.totalReward
          }
        ];
      }
      if (this.gridApi2) {
        this.$nextTick(() => {
          this.gridApi2.sizeColumnsToFit();
        });
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.gridApi.sizeColumnsToFit();

      // default sort
      this.columnApi.getColumn("createdAt").setSort("desc");

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          if (this.item.type.startsWith("TOOD")) {
            getLottoToodNumberItems(
              params.startRow,
              params.endRow,
              params.sortModel,
              params.filterModel,
              `&lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=OPEN`
            )
              .then(data => {
                let lastRow = -1;
                if (data.length < params.endRow - params.startRow) {
                  lastRow =
                    params.endRow -
                    (params.endRow - params.startRow - data.length);
                }
                let index = params.startRow;
                const newData = this.$_.map(data, d => {
                  return {
                    ...d,
                    no: ++index
                  };
                });
                params.successCallback(newData, lastRow);
                this.onLocaleChanged();
                this.gridApi.hideOverlay();
              })
              .catch(error => {
                this.onLocaleChanged();
                this.gridApi.hideOverlay();
              });
          } else {
            getLottoNumberItems(
              params.startRow,
              params.endRow,
              params.sortModel,
              params.filterModel,
              `&lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=OPEN`
            )
              .then(data => {
                let lastRow = -1;
                if (data.length < params.endRow - params.startRow) {
                  lastRow =
                    params.endRow -
                    (params.endRow - params.startRow - data.length);
                }
                let index = params.startRow;
                const newData = this.$_.map(data, d => {
                  return {
                    ...d,
                    no: ++index
                  };
                });
                params.successCallback(newData, lastRow);
                this.onLocaleChanged();
                this.gridApi.hideOverlay();
              })
              .catch(error => {
                this.onLocaleChanged();
                this.gridApi.hideOverlay();
              });
          }
        }
      });
    },
    onGridReady2(params) {
      this.gridApi2 = params.api;
      this.columnApi2 = params.columnApi;

      this.gridApi2.sizeColumnsToFit();

      // default sort
      this.columnApi2.getColumn("createdAt").setSort("desc");

      this.gridApi2.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi2.showLoadingOverlay();

          if (this.item.type.startsWith("TOOD")) {
            getLottoToodNumberItems(
              params.startRow,
              params.endRow,
              params.sortModel,
              params.filterModel,
              `&lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=DELETED`
            )
              .then(data => {
                let lastRow = -1;
                if (data.length < params.endRow - params.startRow) {
                  lastRow =
                    params.endRow -
                    (params.endRow - params.startRow - data.length);
                }
                let index = params.startRow;
                const newData = this.$_.map(data, d => {
                  return {
                    ...d,
                    no: ++index
                  };
                });
                params.successCallback(newData, lastRow);
                this.onLocaleChanged2();
                this.gridApi2.hideOverlay();
              })
              .catch(error => {
                this.onLocaleChanged2();
                this.gridApi2.hideOverlay();
              });
          } else {
            getLottoNumberItems(
              params.startRow,
              params.endRow,
              params.sortModel,
              params.filterModel,
              `&lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=DELETED`
            )
              .then(data => {
                let lastRow = -1;
                if (data.length < params.endRow - params.startRow) {
                  lastRow =
                    params.endRow -
                    (params.endRow - params.startRow - data.length);
                }
                let index = params.startRow;
                const newData = this.$_.map(data, d => {
                  return {
                    ...d,
                    no: ++index
                  };
                });
                params.successCallback(newData, lastRow);
                this.onLocaleChanged2();
                this.gridApi2.hideOverlay();
              })
              .catch(error => {
                this.onLocaleChanged2();
                this.gridApi2.hideOverlay();
              });
          }
        }
      });
    },
    loadData() {
      if (this.item.type.startsWith("TOOD")) {
        getSumLottoToodNumberItems(
          {},
          `lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=OPEN`
        )
          .then(res => {
            this.summary = res;
          })
          .catch(error => {
            this.summary = {
              totalAmount: 0,
              totalNet: 0,
              totalOrderItems: 0,
              totalPay: 0
            };
          });

        getSumOrderLottoToodNumberItems(
          {},
          `lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=OPEN`
        )
          .then(res => {
            this.summaryOrder = res;
          })
          .catch(error => {
            this.summaryOrder = {
              totalOrders: 0
            };
          });

        getSumLottoToodNumberItems(
          {},
          `lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=DELETED`
        )
          .then(res => {
            this.summary2 = res;
          })
          .catch(error => {
            this.summary2 = {
              totalAmount: 0,
              totalNet: 0,
              totalOrderItems: 0,
              totalPay: 0
            };
          });

        getSumOrderLottoNumberItems(
          {},
          `lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=DELETED`
        )
          .then(res => {
            this.summaryOrder2 = res;
          })
          .catch(error => {
            this.summaryOrder2 = {
              totalOrders: 0
            };
          });
      } else {
        getSumLottoNumberItems(
          {},
          `lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=OPEN`
        )
          .then(res => {
            this.summary = res;
          })
          .catch(error => {
            this.summary = {
              totalAmount: 0,
              totalNet: 0,
              totalOrderItems: 0,
              totalPay: 0
            };
          });

        getSumOrderLottoNumberItems(
          {},
          `lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=OPEN`
        )
          .then(res => {
            this.summaryOrder = res;
          })
          .catch(error => {
            this.summaryOrder = {
              totalOrders: 0
            };
          });

        getSumLottoNumberItems(
          {},
          `lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=DELETED`
        )
          .then(res => {
            this.summary2 = res;
          })
          .catch(error => {
            this.summary2 = {
              totalAmount: 0,
              totalNet: 0,
              totalOrderItems: 0,
              totalPay: 0
            };
          });

        getSumOrderLottoNumberItems(
          {},
          `lottoId=${this.item.lottoId}&type=${this.item.type}&number=${this.item.number}&status=DELETED`
        )
          .then(res => {
            this.summaryOrder2 = res;
          })
          .catch(error => {
            this.summaryOrder2 = {
              totalOrders: 0
            };
          });
      }
    }
  }
};
</script>
