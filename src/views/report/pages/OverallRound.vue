<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("overall-report") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("overall_report_subtitle") }}
            </div>
          </template>

          <validation-observer ref="observer">
            <v-breadcrumbs :items="breadcrumbsItems" class="pb-0">
              <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
            <v-form @submit.prevent="onSubmit">
              <v-container>
                <v-row>
                  <v-col class="py-0">
                    <v-radio-group row class="pa-0 ma-0" hide-details>
                      <span class="mx-2 my-auto">{{ $t("product2") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterProduct"
                          :label="$t('product2')"
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
                  >{{ $t("all_product") }}</span
                >
                <ag-grid-vue
                  style="height: 60vh;"
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
                  @row-double-clicked="onRowDoubleClicked"
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

import OverallRoundLink from "@/views/report/grid/OverallRoundLink";

import { getLottoTable, getSumLottos } from "@/api/lotto";
import { getProductById } from "@/api/product";
import { getProductById as getProductLottoById } from "@/api/productLotto";

import { columnDefs } from "@/views/report/grid/OverAllRoundColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "OverallRound",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    OverallRoundLink
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,
    currentOrder: "",
    pinnedBottomRow: [],
    frameworkComponents: null,

    filterProduct: null,

    isFilterChange: false,

    breadcrumbsItems: []
  }),
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.$EventBus.$on(
      "onReportOverallRoundRefresh",
      this.onReportOverallRoundRefresh
    );

    this.initial();
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off(
      "onReportOverallRoundRefresh",
      this.onReportOverallRoundRefresh
    );
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged(locale) {
      this.updateBreadcrumbs(locale);
      if (locale === "th") {
        this.columnApi.setColumnsVisible(["thaiName"], true);
        this.columnApi.setColumnsVisible(["name"], false);
      } else {
        this.columnApi.setColumnsVisible(["thaiName"], false);
        this.columnApi.setColumnsVisible(["name"], true);
      }
    },
    updateBreadcrumbs(locale) {
      this.breadcrumbsItems = [
        {
          text: this.$t("product2"),
          exact: true,
          to: "/report/overall"
        }
      ];
      if (this.product) {
        this.breadcrumbsItems.push({
          text: this.product[getLangNameKeyFromLocale(locale)],
          exact: true,
          to: "/report/overall/product/" + this.product._id
        });
      }
      if (this.productLotto) {
        this.breadcrumbsItems.push({
          text: this.productLotto[getLangNameKeyFromLocale(locale)],
          disabled: true
        });
      }
    },
    async initial() {
      this.productLotto = await getProductLottoById(this.$route.params.id);
      this.product = await getProductById(this.productLotto.productId);

      this.updateBreadcrumbs(this.$i18n.locale);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default lang
      this.onLocaleChanged(this.$i18n.locale);

      // default sort
      this.columnApi.getColumn("resultedAt").setSort("desc");

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getLottoTable(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            "&productLottoId=" + this.$route.params.id
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
                  productId: "รวม",
                  totalItems: res.totalItems,
                  totalAmount: res.totalAmount,
                  totalDiscount: res.totalDiscount,
                  totalNet: res.totalNet,
                  totalReward: res.totalReward,
                  totalProfit: res.totalProfit,
                  totalAnnounceAmount: res.totalAnnounceAmount,
                  totalUserProfit: res.totalUserProfit,
                  totalProfitPercent: res.totalProfitPercent
                }
              ];
            })
            .catch(err => {
              this.pinnedBottomRow = [
                {
                  user: {
                    username: "รวม"
                  },
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
    async onSubmit() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }
      let filter = this.gridApi.getFilterModel();
      if (!filter) {
        filter = {};
      }
      if (this.filterProduct) {
        filter["lottoThaiName"] = {
          type: "contains",
          filter: this.filterProduct
        };
      } else {
        if (filter["lottoThaiName"]) {
          delete filter["lottoThaiName"];
        }
      }

      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
      if (this.isFilterChange) {
        // force for filterDate has changed
        this.gridApi.onFilterChanged();
        this.isFilterChange = false;
      }
    },
    onReportOverallRoundRefresh() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
    },
    onRowDoubleClicked(params) {
      this.$router.push({
        path: "/report/overall/winloss/" + params.data._id.toString()
      });
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
