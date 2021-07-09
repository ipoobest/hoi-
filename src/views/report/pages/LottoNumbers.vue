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
              {{ $t("amount_by_number_subtitle") }}
            </div>
          </template>

          <div style="margin-top: 1rem; min-height: 700px; height: auto">
            <v-row>
              <v-col col="2" class="pl-5 pt-5 pb-5">
                <a href="#" @click="$router.back()">{{ $t("back") }}</a>
              </v-col>
              <v-col col="10" style="text-align: right">
                <v-btn color="info" medium @click="onMenuClicked('types')">
                  <strong>{{ $t("amount_by_type") }}</strong>
                </v-btn>
                <v-btn color="success" medium disabled>
                  <strong>{{ $t("amount_by_number") }}</strong>
                </v-btn>
                <v-btn color="red" medium @click="onMenuClicked('members')">
                  <strong>{{ $t("amount_by_member") }}</strong>
                </v-btn></v-col
              >
            </v-row>
            <ag-grid-vue
              class="ag-theme-alpine"
              :default-col-def="defaultColDef"
              :row-data="rowData"
              :column-defs="columnDefs"
              :animate-rows="true"
              :suppress-drag-leave-hides-columns="true"
              :row-drag-managed="false"
              :floating-filter="false"
              @grid-ready="onGridReady"
            />
            <ag-grid-vue
              class="ag-theme-alpine"
              :default-col-def="defaultColDef2"
              :row-data="rowData2"
              :column-defs="columnDefs2"
              :animate-rows="true"
              :suppress-drag-leave-hides-columns="true"
              :row-drag-managed="false"
              :floating-filter="false"
              :framework-components="frameworkComponents"
              @grid-ready="onGridReady2"
            />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
    <LottoNumberItemDialog v-model="itemDialog" :item="selectedItem" />
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

import { lottoTypes } from "@/utils/LottoTypeFormatter";
import { getItemsByNumberWithReward } from "@/api/orderLottoItem";
import { getLottoById } from "@/api/lotto";

import LottoNumberItemDialog from "@/views/report/components/LottoNumberItemDialog";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import LottoNumberItem from "@/views/report/grid/LottoNumberItem";

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "LottoNumbers",
  components: {
    AgGridVue,
    LottoNumberItemDialog,
    /* eslint-disable */
    AgGridHeaderI18n,
    LottoNumberItem
  },
  data: () => ({
    columnDefs: [],
    columnDefs2: [],
    defaultColDef: {
      sortable: false,
      resizable: true,
      filter: false
    },
    defaultColDef2: {
      sortable: true,
      resizable: true,
      filter: false
    },
    rowData: [],
    rowData2: [],
    displayName: null,
    itemDialog: false,
    selectedItem: {}
  }),
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.initial();
    this.onLocaleChanged();
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
    this.$EventBus.$on(
      "onReportLottoNumberItems",
      this.onReportLottoNumberItems
    );
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
    this.$EventBus.$off(
      "onReportLottoNumberItems",
      this.onReportLottoNumberItems
    );
  },
  methods: {
    onLocaleChanged(locale) {
      if (this.lotto) {
        this.displayName = this.lotto[getLangNameKeyFromLocale(locale)];
      }
    },
    initial() {
      this.columnDefs = [
        {
          headerName: "",
          field: "key",
          width: 125,
          suppressMenu: true
        }
      ];
      this.columnDefs2 = [
        {
          headerName: "",
          field: "key",
          width: 125,
          suppressMenu: true,
          comparator: this.indexComparator
        }
      ];
      getLottoById(this.$route.params.id).then(res => {
        this.lotto = res;
        this.displayName = this.lotto[
          getLangNameKeyFromLocale(this.$i18n.locale)
        ];
        this.initialGridColumns();
      });
    },
    initialGridColumns() {
      this.$_.forOwn(lottoTypes, (value, key) => {
        const check = this.getKey(key) + "Active";
        if (!this.lotto.productConfig[check]) {
          return;
        }
        this.columnDefs.push({
          headerName: key.toLowerCase(),
          field: key,
          width: 125,
          suppressMenu: true,
          cellRendererFramework: "LottoNumberItem",
          headerComponentFramework: "AgGridHeaderI18n"
        });
        this.columnDefs2.push({
          headerName: key.toLowerCase(),
          field: key,
          width: 125,
          suppressMenu: true,
          comparator: this.lottoNumberItemsComparator,
          cellRendererFramework: "LottoNumberItem",
          headerComponentFramework: "AgGridHeaderI18n"
        });
      });
      if (this.gridApi) {
        this.$nextTick(() => {
          this.gridApi.sizeColumnsToFit();
          this.gridApi2.sizeColumnsToFit();
        });
      }
    },
    initialGridData() {
      this.summary = {
        totalAmount: {
          key: this.$t("bet_amount")
        },
        totalDiscount: {
          key: "Affiliate"
        },
        totalReward: {
          key: this.$t("prize")
        },
        totalNet: {
          key: this.$t("net_amount")
        }
      };
      this.$_.forOwn(lottoTypes, (value, key) => {
        this.summary.totalAmount[key] = {
          value: 0
        };
        this.summary.totalDiscount[key] = {
          value: 0
        };
        this.summary.totalReward[key] = {
          value: 0,
          lossClass: true
        };
        this.summary.totalNet[key] = {
          value: 0,
          textClass: true
        };
      });
    },
    getKey(key) {
      if (key === "DIRECTRESULT") {
        return "directResult";
      }
      return this.$_.camelCase(key);
    },
    onMenuClicked(page) {
      this.$router.replace(`/report/lotto/${page}/${this.$route.params.id}`);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.gridApi.setGridAutoHeight(true);

      if (this.gridApi && this.gridApi2) {
        this.loadData();
      }
    },
    onGridReady2(params) {
      this.gridApi2 = params.api;
      this.columnApi2 = params.columnApi;

      this.gridApi2.setGridAutoHeight(true);

      if (this.gridApi && this.gridApi2) {
        this.loadData();
      }
    },
    loadData() {
      this.initialGridData();
      this.rowData = [];

      this.gridApi.showLoadingOverlay();
      this.gridApi2.showLoadingOverlay();
      getItemsByNumberWithReward(
        `?status=OPEN&lottoId=${this.$route.params.id}`
      ).then(res => {
        let rank = 1;
        let currentType = "";
        const ranks = {};
        const toodTotalReward = {};
        this.$_.forEach(res, r => {
          this.summary.totalAmount[r.type].value += r.totalAmount;
          this.summary.totalDiscount[r.type].value += r.totalDiscount;
          this.summary.totalReward[r.type].value += r.totalReward;
          this.summary.totalNet[r.type].value += r.totalProfit;

          if (r.type !== currentType) {
            // new types
            rank = 1;
          }
          if (!ranks[rank]) {
            ranks[rank] = {
              key: "# " + this.$Numeral(rank).format("0,0")
            };
          }
          if (r.type.startsWith("TOOD")) {
            if (!toodTotalReward[r.type]) {
              toodTotalReward[r.type] = {};
            }
            let tood = r.number.split("");
            tood = this.$_.orderBy(tood);
            tood = tood.join("");
            if (!toodTotalReward[r.type][tood]) {
              toodTotalReward[r.type][tood] = {
                number: tood,
                type: r.type,
                totalOrderItems: 0,
                totalAmount: 0,
                totalReward: 0,
                win: r.win
              };
            }
            toodTotalReward[r.type][tood].totalOrderItems += r.totalOrderItems;
            toodTotalReward[r.type][tood].totalAmount += r.totalAmount;
            toodTotalReward[r.type][tood].totalReward += r.totalReward;
          } else {
            ranks[rank][r.type] = {
              number: r.number,
              type: r.type,
              totalOrderItems: r.totalOrderItems,
              totalAmount: r.totalAmount,
              totalReward: r.totalReward,
              win: r.win
            };
            currentType = r.type;
            ++rank;
          }
        });

        const result = [...Object.values(ranks)];
        if (Object.keys(toodTotalReward).length > 0) {
          this.$_.forOwn(toodTotalReward, value => {
            const toodTotalRewardArr = Object.values(value);
            if (toodTotalRewardArr.length > 0) {
              const toodRanks = this.$_.orderBy(
                toodTotalRewardArr,
                ["totalReward"],
                ["desc"]
              );
              for (let i = 0; i < toodRanks.length; i++) {
                const tood = {
                  ...toodRanks[i]
                };
                delete tood.totalPay;
                if (!result[i]) {
                  result[i] = {
                    key: "# " + this.$Numeral(i + 1).format("0,0")
                  };
                }
                result[i][tood.type] = tood;
              }
            }
          });
        }

        this.rowData = [
          this.summary.totalAmount,
          this.summary.totalDiscount,
          this.summary.totalReward,
          this.summary.totalNet
        ];
        this.rowData2 = result;
        this.$nextTick(() => {
          this.gridApi.hideOverlay();
          this.gridApi2.hideOverlay();
          this.gridApi.sizeColumnsToFit();
          this.gridApi2.sizeColumnsToFit();
        });
      });
    },
    onReportLottoNumberItems(item) {
      this.selectedItem = {
        ...item,
        lottoId: this.$route.params.id
      };
      this.itemDialog = true;
    },
    lottoNumberItemsComparator(item1, item2) {
      if (item1 && item2) {
        if (item1.number < item2.number) return -1;
        if (item1.number > item2.number) return 1;
        return 0;
      }
      return 0;
    },
    indexComparator(item1, item2) {
      if (item1 && item2) {
        let newItem1 = Number(item1.substring(1));
        let newItem2 = Number(item2.substring(1));
        if (newItem1 < newItem2) return -1;
        if (newItem1 > newItem2) return 1;
        return 0;
      }
      return 0;
    }
  }
};
</script>
