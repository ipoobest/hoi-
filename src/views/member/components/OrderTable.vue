<template>
  <div class="pt-2">
    <v-card class="my-0">
      <v-card-title class="subheading font-weight-bold">
        <v-icon left color="success">mdi-cash-100</v-icon
        >{{ $t("order_items") }}</v-card-title
      >
      <ag-grid-vue
        style="height: 500px"
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
        :pinned-bottom-row-data="pinnedBottomRow"
        :framework-components="frameworkComponents"
        @grid-ready="onGridReady"
      />
    </v-card>
    <LottoNumberItemBottomSheet
      v-model="bottomSheet"
      :order-lotto-id="bottomSheetOrderLottoId"
    />
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { getOrderLottoTable, getSumOrders } from "@/api/orderLotto";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import PlayerParentId from "@/views/transaction/grid/PlayerParentId";
import BillNo from "@/views/member/grid/BillNo";
import OrderStatus from "@/views/report/grid/OrderStatus";
import LottoNumberItemBottomSheet from "@/views/report/components/LottoNumberItemBottomSheet";

import { columnDefs } from "@/views/transaction/grid/OrderColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  components: {
    AgGridVue,
    LottoNumberItemBottomSheet,
    /* eslint-disable */
    AgGridHeaderI18n,
    PlayerParentId,
    BillNo,
    OrderStatus
  },
  props: {
    userId: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,
    pinnedBottomRow: [],

    bottomSheet: false,
    bottomSheetOrderLottoId: null
  }),
  watch: {
    userId(userId) {
      if (userId) {
        this.gridApi.purgeInfiniteCache();
        this.gridApi.setInfiniteRowCount(0);
        // this.gridApi.refreshInfiniteCache();
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
    onLocaleChanged(locale) {
      this.initialGridColumns(locale);
      this.setGridPinedRow();
    },
    setGridPinedRow() {
      this.pinnedBottomRow = [
        {
          no: this.$t("summary"),
          totalOrderItems: 0,
          totalAmount: 0,
          totalDiscount: 0,
          totalReward: 0,
          totalProfit: 0
        }
      ];
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            no: this.$t("summary"),
            totalOrderItems: this.summary.totalOrderItems,
            totalAmount: this.summary.totalAmount,
            totalDiscount: this.summary.totalDiscount,
            totalReward: this.summary.totalReward,
            totalProfit: this.summary.totalProfit
          }
        ];
      }
    },
    initialGridColumns(locale) {
      if (this.columnApi) {
        if (locale === "th") {
          this.columnApi.setColumnsVisible(["productLottoThaiName"], true);
          this.columnApi.setColumnsVisible(["productLottoName"], false);
        } else {
          this.columnApi.setColumnsVisible(["productLottoThaiName"], false);
          this.columnApi.setColumnsVisible(["productLottoName"], true);
        }
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default lang
      this.initialGridColumns(this.$i18n.locale);

      // default sort
      this.columnApi.getColumn("createdAt").setSort("desc");

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getOrderLottoTable(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            `&userId=${this.userId}`
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
              this.gridApi.hideOverlay();
            })
            .catch(error => {
              this.gridApi.hideOverlay();
            });

          getSumOrders(params.filterModel, `&userId=${this.userId}`).then(
            res => {
              this.summary = res;
              if (!res) {
                this.summary = {
                  totalOrderItems: 0,
                  totalAmount: 0,
                  totalDiscount: 0,
                  totalReward: 0,
                  totalProfit: 0
                };
              }
              this.setGridPinedRow();
            }
          );
        }
      });
    }
  }
};
</script>
