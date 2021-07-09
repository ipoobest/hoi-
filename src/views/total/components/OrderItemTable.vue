<template>
  <div>
    <span class="pr-2 my-auto" style="font-size: 16px; color: #000000">{{
      $t("bet_item_list")
    }}</span>
    <ag-grid-vue
      class="ag-theme-alpine"
      :style="`height: ${height};`"
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

import { columnDefs } from "@/views/total/grid/OrderItemColumnDefs.js";
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
    items: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: "auto"
    },
    autoWidth: {
      type: Boolean,
      default: false
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
    pinnedBottomRow: [],
    currentOrder: null
  }),
  watch: {
    items(value) {
      let index = 1;
      let totalAmount = 0;
      let totalNet = 0;
      const newItems = this.$_.map(value, i => {
        totalAmount += i.amount;
        totalNet += i.net;
        return {
          ...i,
          no: index++
        };
      });
      this.rowData = newItems;
      this.summary = {
        totalAmount,
        totalNet
      };
      this.onLocaleChanged();
      this.$nextTick(() => {
        if (this.autoWidth) {
          this.gridApi.sizeColumnsToFit();
        }
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
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            no: this.$t("summary"),
            amount: this.summary.totalAmount,
            net: this.summary.totalNet
          }
        ];
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      if (this.height === "auto") {
        this.gridApi.setGridAutoHeight(true);
      }
      if (this.autoWidth) {
        this.gridApi.sizeColumnsToFit();
      }
    },
    clearData() {
      this.rowData = [];
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
