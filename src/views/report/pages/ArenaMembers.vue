<template>
  <v-container fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("overall-report") }} {{ displayName }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("amount_by_member_subtitle") }}
            </div>
          </template>

          <div style="margin-top: 1rem; min-height: 700px; height: auto">
            <v-row>
              <v-col col="2" class="pl-5 pt-5 pb-5">
                <a href="#" @click="$router.back()">{{ $t("back") }}</a>
              </v-col>
            </v-row>

            <v-card class="mx-auto" outlined>
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      v-model="filterOrderNo"
                      :label="$t('order_no')"
                      :placeholder="$t('order_no')"
                      style="max-width: 400px"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="green" medium @click="onSubmit">
                      <strong>{{ $t("search2") }}</strong>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <div style="height: 60vh">
              <ag-grid-vue
                style="height: 100%"
                class="ag-theme-alpine"
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
              />
            </div>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

import { getOrderArenaTable, getSumOrderArena } from "@/api/orderArena";
import { getProductArenaById } from "@/api/productArena";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import PlayerMemberId from "@/views/report/grid/PlayerMemberId";
import PlayerParentId from "@/views/report/grid/PlayerParentId";

import { columnDefs } from "@/views/report/grid/ArenaMembersColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "LottoMembers",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    PlayerMemberId,
    PlayerParentId
  },
  data: () => ({
    columnDefs: [],
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: false
    },
    pinnedBottomRow: [],
    displayName: null
  }),
  created() {
    this.columnDefs = this.$_.cloneDeep(columnDefs);
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    getProductArenaById(this.$route.params.id).then(res => {
      this.arena = res;
      this.displayName = this.arena[
        getLangNameKeyFromLocale(this.$i18n.locale)
      ];
    });
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      if (this.arena) {
        this.displayName = this.arena[getLangNameKeyFromLocale(this.$i18n.locale)];
      }      
      this.pinnedBottomRow = [
        {
          no: this.$t("summary"),
          totalAmount: 0,
          totalFee: 0,
          totalReward: 0,
          totalProfit: 0
        }
      ];
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            no: this.$t("summary"),
            totalAmount: this.summary.totalAmount,
            totalFee: this.summary.totalFee,
            totalReward: this.summary.totalReward,
            totalProfit: this.summary.totalProfit
          }
        ];
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default sort
      this.columnApi.getColumn("createdAt").setSort("desc");

      //default filter
      this.gridApi.setFilterModel({
        createdAt: {
          type: "equals",
          filter:
            this.$Moment().startOf("day").format() +
            "," +
            this.$Moment().endOf("day").format()
        }
      });

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getOrderArenaTable(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            `&status=FINISHED&productArenaId=${this.$route.params.id}`
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

          getSumOrderArena(
            params.filterModel,
            `status=FINISHED&productArenaId=${this.$route.params.id}`
          )
            .then(res => {
              this.summary = res;
              this.onLocaleChanged();
            })
            .catch(err => {
              this.onLocaleChanged();
            });
        }
      });
    },
    onSubmit() {
      let filter = this.gridApi.getFilterModel();
      if (!filter) {
        filter = {};
      }
      if (this.filterOrderNo) {
        filter["billNo"] = {
          type: "contains",
          filter: this.filterOrderNo
        };
      } else {
        if (filter["billNo"]) {
          delete filter["billNo"];
        }
      }
      this.gridApi.deselectAll();
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    }
  }
};
</script>
