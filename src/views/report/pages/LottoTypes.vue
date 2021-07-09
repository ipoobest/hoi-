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
              {{ $t("amount_by_type_subtitle") }}
            </div>
          </template>

          <div style="margin-top: 1rem; min-height: 700px; height: auto;">
            <v-row>
              <v-col col="2" class="pl-5 pt-5 pb-5">
                <a href="#" @click="$router.back()">{{ $t("back") }}</a>
              </v-col>
              <v-col col="10" style="text-align: right;">
                <v-btn color="info" medium disabled>
                  <strong>{{ $t("amount_by_type") }}</strong>
                </v-btn>
                <v-btn color="success" medium @click="onMenuClicked('numbers')">
                  <strong>{{ $t("amount_by_number") }}</strong>
                </v-btn>
                <v-btn color="red" medium @click="onMenuClicked('members')">
                  <strong>{{ $t("amount_by_member") }}</strong>
                </v-btn></v-col
              >
            </v-row>
            <ag-grid-vue
              class="ag-theme-alpine"
              :row-height="50"
              :default-col-def="defaultColDef"
              :row-data="rowData"
              :column-defs="columnDefs"
              :animate-rows="true"
              :suppress-drag-leave-hides-columns="true"
              :row-drag-managed="false"
              :floating-filter="false"
              :pinned-bottom-row-data="pinnedBottomRow"
              :framework-components="frameworkComponents"
              @grid-ready="onGridReady"
            />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";

import { lottoTypes } from "@/utils/LottoTypeFormatter";
Object.freeze(lottoTypes);
import { getItemsByType } from "@/api/orderLottoItem";
import { getLottoById } from "@/api/lotto";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";

import { columnDefs } from "@/views/report/grid/LottoTypesColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "LottoTypes",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n
  },
  data: () => ({
    columnDefs,
    defaultColDef: {
      sortable: false,
      resizable: true,
      filter: false
    },
    rowData: [],
    displayName: null
  }),
  computed: {
    me: get("auth/me")
  },
  created() {
    this.myLottoTypes = this.$_.cloneDeep(lottoTypes);
    if (this.me.role.name !== "Modulator") {
      delete this.myLottoTypes.DIRECTRESULT;
    }
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
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged(locale) {
      if (this.lotto) {
        this.displayName = this.lotto[getLangNameKeyFromLocale(locale)];
      }
      this.rowData = [];
      this.$_.forOwn(this.myLottoTypes, (value, key) => {
        this.rowData.push({
          type: this.$t(key.toLowerCase()),
          rawType: key
        });
      });
    },
    onMenuClicked(page) {
      this.$router.replace(`/report/lotto/${page}/${this.$route.params.id}`);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.gridApi.setGridAutoHeight(true);

      this.loadData();
    },
    loadData() {
      this.gridApi.showLoadingOverlay();
      getItemsByType(`?status=OPEN&lottoId=${this.$route.params.id}`).then(
        res => {
          const newRowData = [];
          let totalAmount = 0;
          let totalDiscount = 0;
          let totalReward = 0;
          let totalProfit = 0;
          this.$_.forEach(this.rowData, r => {
            let newRow = this.$_.cloneDeep(r);
            const rows = this.$_.filter(res, o => o.type === r.rawType);
            if (rows.length > 0) {
              totalAmount += rows[0].totalAmount;
              totalDiscount += rows[0].totalDiscount;
              totalReward += rows[0].totalReward;
              totalProfit += rows[0].totalProfit;
              newRow = {
                ...rows[0],
                ...r
              };
            }
            newRowData.push(newRow);
          });
          this.rowData = newRowData;
          this.pinnedBottomRow = [
            {
              type: this.$t("summary"),
              totalAmount: totalAmount,
              totalDiscount: totalDiscount,
              totalReward: totalReward,
              totalProfit: totalProfit
            }
          ];
          this.gridApi.hideOverlay();
          this.$nextTick(() => {
            this.gridApi.sizeColumnsToFit();
          });
        }
      );
    }
  }
};
</script>
