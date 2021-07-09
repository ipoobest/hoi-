<template>
  <div class="pt-2">
    <v-card class="my-0">
      <v-card-title class="subheading font-weight-bold">
        <v-icon left color="success">mdi-bank-transfer</v-icon
        >{{ $t("previous_transactions") }}</v-card-title
      >
      <ag-grid-vue
        style="height: 500px;"
        class="ag-theme-alpine"
        row-selection="single"
        row-model-type="infinite"
        :column-defs="columnDefs"
        :default-col-def="{
          resizable: true
        }"
        :animate-rows="true"
        :suppress-drag-leave-hides-columns="true"
        :row-drag-managed="false"
        :floating-filter="false"
        @grid-ready="onGridReady"
      />
    </v-card>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { getPayment } from "@/api/payment.js";

import TransactionId from "@/views/transaction/grid/TransactionId";
import TransactionType from "@/views/transaction/grid/TransactionType";
import MemberId from "@/views/transaction/grid/MemberId";
import Status from "@/views/transaction/grid/Status";

import { columnDefs } from "@/views/transaction/grid/PreviousTransactionColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  components: {
    AgGridVue,
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
    columnApi: null
  }),
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
          const req = `&userId=${
            this.userId
          }&createdAt_lte=${encodeURIComponent(
            this.$Moment(this.createdAt).subtract(1, "seconds").format()
          )}`;
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
    }
  }
};
</script>
