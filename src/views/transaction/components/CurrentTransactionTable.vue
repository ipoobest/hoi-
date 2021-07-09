<template>
  <div>
    <v-card class="my-0">
      <v-card-title class="subheading font-weight-bold">
        <v-icon left color="success">
          mdi-credit-card-outline
        </v-icon>
        {{ $t("present_value") }}</v-card-title
      >
      <ag-grid-vue
        style="height: 7.7rem;"
        class="ag-theme-alpine"
        row-selection="single"
        :column-defs="columnDefs"
        :default-col-def="{
          sortable: true,
          resizable: true
        }"
        :row-data="rowData"
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
import { getUserById } from "@/api/user.js";
import { getSumDateOrders } from "@/api/orderLotto.js";

import TransactionId from "@/views/transaction/grid/TransactionId";
import MemberId from "@/views/transaction/grid/MemberId";

import { columnDefs } from "@/views/transaction/grid/CurrentTransactionColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    TransactionId,
    MemberId
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
    columnApi: null
  }),
  watch: {
    userId(userId) {
      this.onLoadData(userId);
    }
  },
  created() {
    if (this.userId) {
      this.onLoadData(this.userId);
    }
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    onLoadData(userId) {
      getUserById(userId)
        .then(res => {
          const rowData = {
            ...res,
            todayBet: 0,
            totalBetInLast7Days: 0
          };
          const startedAt = this.$Moment().subtract(7, "days").startOf("day");
          const endedAt = this.$Moment().endOf("day");
          getSumDateOrders(
            {},
            `status_in=FINISHED&status_in=WAITING&createdAt_lte=${encodeURIComponent(
              endedAt.format()
            )}&createdAt_gte=${encodeURIComponent(
              startedAt.format()
            )}&userId=${userId}`
          )
            .then(res => {
              let todayBet = 0;
              let totalBetInLast7Days = 0;
              if (res) {
                this.$_.forEach(res, r => {
                  if (r.date === this.$Moment().format("YYYY-MM-DD")) {
                    todayBet = r.totalAmount;
                  }
                  totalBetInLast7Days += r.totalAmount;
                });
              }
              rowData.todayBet = todayBet;
              rowData.totalBetInLast7Days = totalBetInLast7Days;
              this.rowData = [rowData];
            })
            .catch(error => {
              this.rowData = [rowData];
            });
        })
        .catch(err => err);
    }
  }
};
</script>
