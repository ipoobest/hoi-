<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("outstanding") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("outstanding_subtitle") }}
            </div>
          </template>

          <v-row>
            <a href="#" class="pl-6 pt-5" @click="$router.back()">{{
              $t("back")
            }}</a>
          </v-row>

          <v-form>
            <v-container>
              <span
                class="pr-2 my-auto"
                style="font-size: 16px; color: #000000;"
                >{{ $t("order_list") }}</span
              >
              <ag-grid-vue
                style="height: 68vh;"
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
                @grid-ready="onGridReady"
                @cell-focused="onCellFocused"
              />
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

import MemberId from "@/views/product/components/MemberId";

import { getLottoById } from "@/api/lotto.js";
import { getOrderLottoTableByLottoId } from "@/api/orderLotto.js";

import { columnDefs } from "@/views/product/grid/OutstandingColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "App",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    MemberId
  },
  data: () => ({
    columnDefs,
    gridApi: null,
    columnApi: null,
    currentOrder: "",
    pinnedBottomRow: []
  }),
  created() {
    getLottoById(this.$route.params.id).then(res => {
      this.lotto = res;
      this.pinnedBottomRow = [
        {
          billNo: this.$t("summary"),
          totalAmount: res.totalAmount,
          totalDiscount: res.totalDiscount,
          totalNet: res.totalNet,
          totalReward: res.totalReward,
          totalProfit: res.totalProfit
        }
      ];
    });
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      if (this.lotto) {
        this.pinnedBottomRow = [
          {
            billNo: this.$t("summary"),
            totalAmount: this.lotto.totalAmount,
            totalDiscount: this.lotto.totalDiscount,
            totalNet: this.lotto.totalNet,
            totalReward: this.lotto.totalReward,
            totalProfit: this.lotto.totalProfit
          }
        ];
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();
          getOrderLottoTableByLottoId(
            this.$route.params.id,
            ["WAITING"],
            params.startRow,
            params.endRow,
            params.sortModel
          )
            .then(data => {
              var rowsThisPage = data;
              var lastRow = -1;
              if (data.length < params.endRow - params.startRow) {
                lastRow =
                  params.endRow -
                  (params.endRow - params.startRow - data.length);
              }
              params.successCallback(rowsThisPage, lastRow);
              this.gridApi.hideOverlay();
            })
            .catch(error => {
              this.gridApi.hideOverlay();
            });
        }
      });
    },
    onSearchClicked() {
      if (this.filterOption === "BAHT") {
        let profitPercentFilterComponent = this.gridApi.getFilterInstance(
          "profitPercent"
        );
        profitPercentFilterComponent.setModel(null);

        const profitFilterComponent = this.gridApi.getFilterInstance("profit");
        profitFilterComponent.setModel({
          type: "inRange",
          filter: this.filterValue - this.filterDiff,
          filterTo: this.filterValue + this.filterDiff
        });
        this.gridApi.onFilterChanged();
      } else if (this.filterOption === "PERCENT") {
        let profitFilterComponent = this.gridApi.getFilterInstance("profit");
        profitFilterComponent.setModel(null);

        const profitPercentFilterComponent = this.gridApi.getFilterInstance(
          "profitPercent"
        );
        profitPercentFilterComponent.setModel({
          type: "inRange",
          filter: this.filterValue - this.filterDiff,
          filterTo: this.filterValue + this.filterDiff
        });
        this.gridApi.onFilterChanged();
      }
    },
    onClearClicked() {
      this.filterValue = null;
      this.filterDiff = null;
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setFilterModel(null);
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
