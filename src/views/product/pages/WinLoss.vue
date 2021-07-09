<template>
  <v-container id="user-profile" fluid tag="section">
    <template v-if="lotto && lotto.result && lotto.type === 'YEEKEE'">
      <v-row>
        <a href="#" class="pt-5 pl-5" @click="$router.back()">{{
          $t("back")
        }}</a>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("result")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <div class="text-center">
                  <v-btn
                    v-for="(num, index) in lotto.result.split('')"
                    :key="num"
                    outlined
                    class="pa-0 mx-1"
                    style="min-width: 2rem;"
                    :style="
                      $vuetify.theme.dark
                        ? 'border: thin solid rgba(255, 255, 255, 0.12)'
                        : 'border: thin solid #ebebeb'
                    "
                    ><strong
                      class="text-center lotto-number"
                      :class="{
                        'info--text': index >= 3,
                        'success--text': lotto.yeekeeSum.length - index <= 3
                      }"
                      >{{ num }}</strong
                    ></v-btn
                  >
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("direct3top")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <LottoNumber :number="lotto.result3Top"></LottoNumber>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("direct2top")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <LottoNumber :number="lotto.result2Under"></LottoNumber>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("total_yeekee_shoot")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <strong class="lotto-number">{{ lotto.yeekeeSum }}</strong>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header"
                  >{{ $t("record") }} 16</strong
                >
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <strong class="lotto-number info--text">{{
                      lotto.at16thNumber
                    }}</strong>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("first_member_shoot_reward")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <strong class="lotto-number grey--text">{{
                      lotto.at1stUsername
                    }}</strong>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("16th_member_shoot_reward")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <strong class="lotto-number grey--text">{{
                      lotto.at16thUsername
                    }}</strong>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <template v-else-if="lotto && lotto.result && lotto.result.length === 6">
      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("result")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <div class="text-center">
                  <v-btn
                    v-for="(num, index) in lotto.result.split('')"
                    :key="num"
                    outlined
                    class="pa-0 mx-1"
                    style="min-width: 2rem;"
                    :style="
                      $vuetify.theme.dark
                        ? 'border: thin solid rgba(255, 255, 255, 0.12)'
                        : 'border: thin solid #ebebeb'
                    "
                    ><strong
                      class="text-center lotto-number"
                      :class="{
                        'info--text': index >= 3,
                        'success--text': 6 - index <= 2
                      }"
                      >{{ num }}</strong
                    ></v-btn
                  >
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("direct3front")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <LottoNumber :number="lotto.result3Front"></LottoNumber>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("direct3under")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <LottoNumber :number="lotto.result3Under"></LottoNumber>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("direct2under")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <LottoNumber :number="lotto.result2Under"></LottoNumber>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <template v-else-if="lotto && lotto.result && lotto.result.length <= 5">
      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("result")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <div class="text-center">
                  <v-btn
                    v-for="(num, index) in lotto.result.split('')"
                    :key="num"
                    outlined
                    class="pa-0 mx-1"
                    style="min-width: 2rem;"
                    :style="
                      $vuetify.theme.dark
                        ? 'border: thin solid rgba(255, 255, 255, 0.12)'
                        : 'border: thin solid #ebebeb'
                    "
                    ><strong
                      class="text-center lotto-number"
                      :class="{
                        'info--text': index >= 3,
                        'success--text': 6 - index <= 2
                      }"
                      >{{ num }}</strong
                    ></v-btn
                  >
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("direct3top")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <LottoNumber :number="lotto.result3Top"></LottoNumber>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="mx-auto" outlined raised>
            <v-list-item>
              <v-list-item-content>
                <strong class="text-center lotto-header">{{
                  $t("direct2under")
                }}</strong>
                <v-divider style="margin: 10px 0;" />
                <v-row>
                  <v-col class="inside-col text-center mb-1" cols="12">
                    <LottoNumber :number="lotto.result2Under"></LottoNumber>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("winloss") }} {{ lotto[getLangNameKeyFromLocale(locale)] }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("winloss_subtitle") }}
            </div>
          </template>

          <v-form>
            <v-container>
              <span
                class="pr-2 my-auto"
                style="font-size: 16px; color: #000000;"
                >{{ $t("order_list") }}</span
              >
              <ag-grid-vue
                style="height: 35vh;"
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
              />
              <br />
              <OrderItemTable :current-order="currentOrder" />
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";
import OrderItemTable from "@/views/product/components/OrderItemTable";

import { getLottoById } from "@/api/lotto.js";
import { getOrderLottoTableByLottoId } from "@/api/orderLotto.js";

import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import LottoNumber from "@/components/LottoNumber";
import PlayerMemberId from "@/views/product/components/PlayerMemberId";
import OrderStatus from "@/views/product/components/OrderStatus";

import { columnDefs } from "@/views/product/grid/WinLossColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "App",
  components: {
    AgGridVue,
    OrderItemTable,
    LottoNumber,
    /* eslint-disable */
    AgGridHeaderI18n,
    BlankPinnedRowCellRenderer,
    PlayerMemberId,
    OrderStatus
  },
  data: () => ({
    columnDefs,
    getLangNameKeyFromLocale,
    lotto: {},
    gridApi: null,
    columnApi: null,
    currentOrder: "",
    pinnedBottomRow: []
  }),
  computed: {
    locale: get("global/locale")
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    getLottoById(this.$route.params.id).then(res => {
      this.lotto = res;
      this.setPinnedBottomRow();
    });
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.setPinnedBottomRow();
    },
    setPinnedBottomRow() {
      if (this.lotto) {
        this.pinnedBottomRow = [
          {
            billNo: this.$t("summary"),
            totalAmount: this.lotto.totalAmount,
            totalDiscount: this.lotto.totalDiscount,
            totalNet: this.lotto.totalNet,
            totalReward: this.lotto.totalReward,
            totalProfit: this.lotto.totalProfit,
            totalCancelOrder: this.lotto.totalCancelOrder
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
            ["FINISHED", "CANCELLED"],
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
.warning-score {
  background-color: rgba(246, 223, 185, 0.4);
}

.bad-score {
  background-color: rgba(255, 128, 171, 0.4);
}
</style>
