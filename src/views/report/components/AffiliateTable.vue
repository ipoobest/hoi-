<template>
  <div>
    <span class="pr-2 my-auto" style="font-size: 16px; color: #000000;">{{
      $t("affiliate_list")
    }}</span>
    <ag-grid-vue
      style="height: 300px;"
      class="ag-theme-alpine"
      row-selection="single"
      :column-defs="columnDefs"
      :row-data="rowData"
      :animate-rows="true"
      :suppress-drag-leave-hides-columns="true"
      :row-drag-managed="false"
      :floating-filter="false"
      :framework-components="frameworkComponents"
      :pinned-bottom-row-data="pinnedBottomRow"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import AffiliateMemberId from "@/views/report/grid/AffiliateMemberId";

import { columnDefs } from "@/views/report/grid/AffiliateColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    AffiliateMemberId
  },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,
    pinnedBottomRow: []
  }),
  watch: {
    order(value) {
      if (value && value.discounts && value.discounts.discounts) {
        this.rowData = value.discounts.discounts;
        let totalAmount = 0;
        let totalShare = 0;
        this.$_.forEach(this.rowData, d => {
          totalAmount += d.amount;
          totalShare += d.share;
        });
        this.summary = {
          totalAmount,
          totalShare
        };
        this.onLocaleChanged();
      } else {
        this.rowData = [];
      }
    }
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);

    this.pinnedBottomRow = [
      {
        username: this.$t("summary"),
        amount: "0.00",
        share: "0.00"
      }
    ];
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.pinnedBottomRow = [
        {
          username: this.$t("summary"),
          amount: "0.00",
          share: "0.00"
        }
      ];
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            username: this.$t("summary"),
            amount: this.$Numeral(this.summary.totalAmount).format("0,0.00"),
            share: this.$Numeral(this.summary.totalShare).format("0,0.00")
          }
        ];
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
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
