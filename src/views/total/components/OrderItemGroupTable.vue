<template>
  <validation-observer ref="observer">
    <v-form @submit.prevent="onSubmit">
      <v-row>
        <v-radio-group
          v-model="filterOption"
          row
          class="pa-0 ma-0 pl-3 filter-dates"
          hide-details
        >
          <span class="pr-2 my-auto">{{ $t("filter_by") }}</span>
          <div>
            <v-select
              v-model="filterType"
              :items="typeItems"
              :label="$t('type')"
              item-text="label"
              item-value="value"
            >
              <v-icon slot="prepend">{{ icon }}</v-icon>
            </v-select>
          </div>
          <span class="mx-2 my-auto">{{ $t("number") }}</span>
          <div>
            <v-text-field
              v-model="filterNumber"
              :label="$t('number')"
              type="text"
            />
          </div>
          <v-btn type="submit" color="success" class="mx-2 my-auto">
            <strong>{{ $t("search2") }}</strong>
          </v-btn>
        </v-radio-group>
      </v-row>
      <span class="pr-2 my-auto" style="font-size: 16px; color: #000000;">{{
        $t("order_list")
      }}</span>
      <ag-grid-vue
        style="height: 300px;"
        class="ag-theme-alpine"
        row-selection="single"
        row-model-type="infinite"
        :column-defs="columnDefs"
        :animate-rows="true"
        :suppress-drag-leave-hides-columns="true"
        :row-drag-managed="false"
        :floating-filter="false"
        :pinned-bottom-row-data="pinnedBottomRow"
        :framework-components="frameworkComponents"
        @grid-ready="onGridReady"
        @cell-focused="onCellFocused"
      />
    </v-form>
  </validation-observer>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { lottoTypes } from "@/utils/LottoTypeFormatter";
import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";

import Type from "@/views/total/grid/Type";

import { columnDefs } from "@/views/total/grid/OrderItemColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

import {
  getLottoItemGroupsTable,
  getSumLottoItemGroups
} from "@/api/lottoItemGroup.js";

export default {
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    Type
  },
  props: {
    currentLotto: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    columnDefs,
    filterType: null,
    filterNumber: null,
    typeItems: [],
    rowData: [],
    gridApi: null,
    columnApi: null,
    pinnedBottomRow: []
  }),
  watch: {
    currentLotto() {
      this.onSubmit();
    }
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.onLocaleChanged();
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.typeItems = [
        {
          label: this.$t("all"),
          value: null
        }
      ];
      this.$_.forOwn(lottoTypes, (value, key) => {
        this.typeItems.push({
          label: this.$t(key.toLowerCase()),
          value: key
        });
      });
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          if (!this.currentLotto) {
            params.successCallback([], 0);
            return;
          }

          this.gridApi.showLoadingOverlay();

          getLottoItemGroupsTable(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            `&lottoId=${this.currentLotto._id}`
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

          getSumLottoItemGroups(
            params.filterModel,
            `&lottoId=${this.currentLotto._id}`
          )
            .then(res => {
              this.pinnedBottomRow = [
                {
                  type: "รวม",
                  number: "",
                  totalOrders: res.totalOrders,
                  totalOrderItems: res.totalOrderItems,
                  totalAmount: res.totalAmount,
                  totalNet: res.totalNet
                }
              ];
            })
            .catch(err => {
              this.pinnedBottomRow = [
                {
                  type: "รวม",
                  number: "",
                  totalOrders: 0,
                  totalOrderItems: 0,
                  totalAmount: 0,
                  totalNet: 0
                }
              ];
            });
        }
      });
    },
    onSubmit() {
      let filter = this.gridApi.getFilterModel();
      if (!filter) {
        filter = {};
      }
      if (this.filterType) {
        filter["type"] = {
          type: "contains",
          filter: this.filterType
        };
      } else {
        if (filter["type"]) {
          delete filter["type"];
        }
      }
      if (this.filterNumber) {
        filter["number"] = {
          type: "contains",
          filter: this.filterNumber
        };
      } else {
        if (filter["number"]) {
          delete filter["number"];
        }
      }

      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
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
