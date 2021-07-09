<template>
  <div>
    <span class="pr-2 my-auto" style="font-size: 16px; color: #000000;">{{
      $t("bet_item_list")
    }}</span>
    <ag-grid-vue
      class="ag-theme-alpine"
      :default-col-def="defaultColDef"
      :column-defs="columnDefs"
      :row-data="rowData"
      :animate-rows="true"
      :suppress-drag-leave-hides-columns="true"
      :row-drag-managed="false"
      :floating-filter="false"
      :pinned-bottom-row-data="pinnedBottomRow"
      :framework-components="frameworkComponents"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import Status from "@/views/product/components/Status";
import Type from "@/views/product/components/Type";

import { getOrderLottoItem } from "@/api/orderLottoItem.js";

import { columnDefs } from "@/views/product/grid/OrderItemColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    Type,
    Status
  },
  props: {
    currentOrder: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    columnDefs,
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: false
    },
    rowData: [],
    gridApi: null,
    columnApi: null,
    pinnedBottomRow: []
  }),
  watch: {
    currentOrder(currentOrder) {
      this.pinnedBottomRow = [
        {
          no: this.$t("summary"),
          amount: currentOrder.totalAmount,
          net: currentOrder.totalNet,
          reward: currentOrder.totalReward,
          profit: currentOrder.totalProfit
        }
      ];
      this.gridApi.showLoadingOverlay();
      getOrderLottoItem(currentOrder._id)
        .then(res => {
          let index = 1;
          this.rowData = this.$_.map(res, r => {
            return {
              ...r,
              no: index++
            };
          });
        })
        .catch(error => {
          this.gridApi.hideOverlay();
        });
    }
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      if (this.currentOrder) {
        this.pinnedBottomRow = [
          {
            no: this.$t("summary"),
            amount: this.currentOrder.totalAmount,
            net: this.currentOrder.totalNet,
            reward: this.currentOrder.totalReward,
            profit: this.currentOrder.totalProfit
          }
        ];
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.gridApi.setGridAutoHeight(true);
    }
  }
};
</script>

<style>
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
