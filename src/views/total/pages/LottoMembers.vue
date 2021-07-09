<template>
  <v-container fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("outstanding") }} {{ displayName }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("amount_by_member_subtitle") }}
                </div></v-col
              >
            </v-row>
          </template>

          <div style="margin-top: 1rem; min-height: 700px; height: auto;">
            <v-row>
              <v-col col="2" class="pl-5 pt-5 pb-5">
                <a href="#" @click="$router.back()">{{ $t("back") }}</a>
              </v-col>
              <v-col col="10" style="text-align: right;">
                <v-btn color="info" medium @click="onMenuClicked('types')">
                  <strong>{{ $t("amount_by_type") }}</strong>
                </v-btn>
                <v-btn color="success" medium @click="onMenuClicked('numbers')">
                  <strong>{{ $t("amount_by_number") }}</strong>
                </v-btn>
                <v-btn color="red" medium disabled>
                  <strong>{{ $t("amount_by_member") }}</strong>
                </v-btn></v-col
              >
            </v-row>

            <v-card class="mx-auto" outlined>
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-switch
                      v-model="isCancelled"
                      :label="`${$t('cancelled')} ${
                        isCancelled ? $t('open') : $t('close')
                      }`"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="filterOrderNo"
                      :label="$t('order_no')"
                      :placeholder="$t('order_no')"
                      style="max-width: 400px;"
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
            <v-row no-gutters>
              <v-col cols="2" class="text-right">
                <v-card class="pa-5" outlined tile>
                  <span class="text-h2">{{ $t("orders") }}</span>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card class="pa-5" outlined tile>
                  <span v-if="summary" class="text-h2 font-weight-bold">{{
                    $Numeral(summary.totalOrders).format("0,0")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="2" class="text-right">
                <v-card class="pa-5" outlined tile>
                  <span class="text-h2">{{ $t("items") }}</span>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card class="pa-5" outlined tile>
                  <span v-if="summary" class="text-h2 font-weight-bold">{{
                    $Numeral(summary.totalOrderItems).format("0,0")
                  }}</span>
                </v-card>
              </v-col>
            </v-row>
            <ag-grid-vue
              style="height: 650px;"
              class="ag-theme-alpine"
              :default-col-def="defaultColDef"
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
              @selection-changed="onSelectionChanged"
            />
          </div>
          <div style="margin-top: 3rem; height: auto;">
            <OrderItemTable ref="item" :items="orderItems" />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

import { lottoTypes } from "@/utils/LottoTypeFormatter";
import { getOrderLottoTable, getSumOrders } from "@/api/orderLotto";
import { getLottoById } from "@/api/lotto";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import PlayerMemberId from "@/views/total/grid/PlayerMemberId";
import PlayerParentId from "@/views/total/grid/PlayerParentId";
import OrderItemTable from "@/views/total/components/OrderItemTable";

import { columnDefs } from "@/views/total/grid/LottoMembersColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "LottoMembers",
  components: {
    AgGridVue,
    OrderItemTable,
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
    displayName: null,
    orderItems: [],
    filterOrderNo: null,
    isCancelled: false
  }),
  created() {
    this.columnDefs = this.$_.cloneDeep(columnDefs);
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    getLottoById(this.$route.params.id).then(res => {
      this.lotto = res;
      this.displayName = this.lotto[
        getLangNameKeyFromLocale(this.$i18n.locale)
      ];
    });
    this.onLocaleChanged();
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
    this.$EventBus.$on("onTotalLottoMembers", this.onTotalLottoMembers);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
    this.$EventBus.$on("onTotalLottoMembers", this.onTotalLottoMembers);
  },
  methods: {
    onLocaleChanged(locale) {
      if (this.lotto) {
        this.displayName = this.lotto[getLangNameKeyFromLocale(locale)];
      }
      this.rowData = [];
      this.$_.forOwn(lottoTypes, (value, key) => {
        this.rowData.push({
          type: this.$t(key.toLowerCase()),
          rawType: key
        });
      });

      this.initialGridColumns(locale);
      this.setGridPinedRow();
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
    setGridPinedRow() {
      this.pinnedBottomRow = [
        {
          no: this.$t("summary"),
          totalOrderItems: 0,
          totalAmount: 0
        }
      ];
      if (this.summary) {
        this.pinnedBottomRow = [
          {
            no: this.$t("summary"),
            totalOrderItems: this.summary.totalOrderItems,
            totalAmount: this.summary.totalAmount
          }
        ];
      }
    },
    onMenuClicked(page) {
      this.$router.replace(`/total/lotto/${page}/${this.$route.params.id}`);
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

          let status = "";
          if (this.isCancelled) {
            status = "&status=CANCELLED";
          } else {
            status = "&status_in=WAITING&status_in=FINISHED";
          }

          getOrderLottoTable(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            `${status}&lottoId=${this.$route.params.id}`
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

          getSumOrders(
            params.filterModel,
            `${status}&lottoId=${this.$route.params.id}`
          ).then(res => {
            this.summary = res;
            if (!res) {
              this.summary = {
                totalOrderItems: 0,
                totalAmount: 0
              };
            }
            this.setGridPinedRow();
          });
        }
      });
    },
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows()[0];
      this.orderItems = selectedRows.items;
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

      this.$refs.item.clearData();
    }
  }
};
</script>
