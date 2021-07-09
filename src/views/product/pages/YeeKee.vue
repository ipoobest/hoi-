<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("yeekee_table_round") }} {{ lotto.round }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{
                $t("yeekee_table_subtitle", [
                  $Numeral(lotto.totalNet).format("0,0.00"),
                  $Numeral(lotto.totalOrders).format("0,0"),
                  $Numeral(lotto.totalOrderItems).format("0,0")
                ])
              }}
            </div>
          </template>

          <v-row>
            <a href="#" class="pl-6 pt-5" @click="$router.back()">{{
              $t("back")
            }}</a>
          </v-row>

          <validation-observer ref="observer">
            <v-form>
              <v-container class="py-0">
                <v-row>
                  <v-col class="py-0">
                    <v-radio-group
                      v-model="filterOption"
                      row
                      class="pa-0 ma-0"
                      hide-details
                    >
                      <span class="pr-2 my-auto">{{ $t("filter_by") }}</span>
                      <v-radio
                        :label="$t('yeekee_profit')"
                        value="BAHT"
                      ></v-radio>
                      <v-radio
                        :label="$t('yeekee_profit_pencentage')"
                        value="PERCENT"
                      ></v-radio>
                      <v-radio
                        :label="$t('yeekee_number')"
                        value="NUMBER"
                      ></v-radio>
                      <template v-if="filterOption === 'NUMBER'">
                        <span class="mx-2 my-auto">{{ $t("direct3top") }}</span>
                        <div>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('direct3top')"
                            rules="numeric"
                          >
                            <v-text-field
                              v-model="filterDirect3Top"
                              :label="$t('direct3top')"
                              type="text"
                              maxlength="3"
                              :error-messages="errors"
                            />
                          </validation-provider>
                        </div>
                        <span class="mx-2 my-auto">{{
                          $t("direct2under")
                        }}</span>
                        <div>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('direct2under')"
                            rules="numeric"
                          >
                            <v-text-field
                              v-model="filterDirect2Under"
                              :label="$t('direct2under')"
                              type="text"
                              maxlength="2"
                              :error-messages="errors"
                            />
                          </validation-provider>
                        </div>
                      </template>
                      <template v-else>
                        <span class="mx-2 my-auto">{{
                          $t("pure_amount")
                        }}</span>
                        <div>
                          <v-text-field
                            v-model.number="filterValue"
                            :label="$t('pure_amount')"
                            type="number"
                          />
                        </div>
                        <span class="mx-2 my-auto">{{ $t("tolerances") }}</span>
                        <div>
                          <v-text-field
                            v-model.number="filterDiff"
                            :label="$t('tolerances')"
                            type="number"
                          />
                        </div>
                      </template>
                      <v-btn
                        color="success"
                        class="mx-2 my-auto"
                        @click="onSearchClicked"
                      >
                        <strong>{{ $t("search2") }}</strong>
                      </v-btn>
                      <v-btn
                        color="info"
                        class="mx-2 my-auto"
                        @click="onClearClicked"
                      >
                        <strong>{{ $t("show_all") }}</strong>
                      </v-btn>
                      <v-btn
                        color="error"
                        class="mx-2 my-auto"
                        @click="onCalculateClicked"
                      >
                        <strong>{{ $t("re_calculate") }}</strong>
                      </v-btn>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <!-- <v-row>
                <v-col class="py-0">
                  <v-radio-group row class="pa-0 ma-0" hide-details>
                    <span class="pr-2 my-auto"
                      >ค้นหาตามตัวเลข 3 หลักหรือ 2 หลัก</span
                    >
                    <div>
                      <v-text-field label="กรุณาใส่จำนวน" />
                    </div>
                    <v-btn color="success" class="mx-2 my-auto">
                      ค้นหา
                    </v-btn>
                  </v-radio-group>
                </v-col>
              </v-row> -->
                <v-tabs>
                  <span
                    class="pr-2 my-auto"
                    style="font-size: 16px; color: #000000;"
                    >{{ $t("display_mode") }}</span
                  >
                  <v-tab @click="mode = 'ALL'">{{ $t("all") }}</v-tab>
                  <v-tab @click="mode = 'TOP'">{{ $t("only_top") }}</v-tab>
                  <v-tab @click="mode = 'UNDER'">{{ $t("only_under") }}</v-tab>
                </v-tabs>
                <ag-grid-vue
                  style="height: 60vh;"
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
                  @grid-ready="onGridReady"
                />
              </v-container>
            </v-form>
          </validation-observer>
        </base-material-card>
      </v-col>
    </v-row>
    <v-overlay :value="processing">
      <div class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <div>{{ $t("loading_data") }}</div>
      </div>
    </v-overlay>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

import { getYeeKeeTable, getSimulate } from "@/api/yeekeeTable.js";
import { getLottoById } from "@/api/lotto.js";

import { columnDefs } from "@/views/product/grid/YeekeeTableColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "App",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n
  },
  data: () => ({
    columnDefs,
    lotto: {},
    processing: false,
    rowData: [],
    gridApi: null,
    columnApi: null,
    filterOption: "BAHT",
    filterValue: null,
    filterDiff: null,
    filterDirect3Top: null,
    filterDirect2Under: null,
    mode: "ALL"
  }),
  computed: {},
  watch: {
    mode(mode) {
      const allColumes = [
        "result3Top",
        "result2Under",
        "loss",
        "lossPercent",
        "lossTop",
        "lossTopPercent",
        "lossUnder",
        "lossUnderPercent",
        "profit",
        "profitPercent",
        "profitTop",
        "profitTopPercent",
        "profitUnder",
        "profitUnderPercent",
        "lossDirect2Top",
        "lossDirect2Under",
        "lossRun3Top",
        "lossRun2Under",
        "lossDirect3Top",
        "lossTood3Top",
        "countAll"
      ];
      const topColumes = [
        "lossTop",
        "lossTopPercent",
        "profitTop",
        "profitTopPercent",
        "lossDirect2Top",
        "lossRun3Top",
        "lossDirect3Top",
        "lossTood3Top",
        "countTop"
      ];
      const underColumes = [
        "lossUnder",
        "lossUnderPercent",
        "profitUnder",
        "profitUnderPercent",
        "lossDirect2Under",
        "lossRun2Under",
        "countUnder"
      ];

      if (mode === "ALL") {
        this.columnApi.setColumnsVisible(allColumes, true);
        this.columnApi.setColumnsVisible(["countTop", "countUnder"], false);
      } else if (mode === "TOP") {
        this.columnApi.setColumnsVisible(topColumes, true);
        this.columnApi.setColumnsVisible([...underColumes, "countAll"], false);
      } else if (mode === "UNDER") {
        this.columnApi.setColumnsVisible([...topColumes, "countAll"], false);
        this.columnApi.setColumnsVisible(underColumes, true);
      }
    }
  },
  created() {
    this.initial();
  },
  methods: {
    async initial() {
      this.lotto = await getLottoById(this.$route.params.id);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();
          getYeeKeeTable(
            this.$route.params.id,
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel
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
      this.onSearchClicked();
    },
    async onSearchClicked() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }
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
      } else if (this.filterOption === "NUMBER") {
        const profitFilterComponent = this.gridApi.getFilterInstance("profit");
        profitFilterComponent.setModel(null);
        const profitPercentFilterComponent = this.gridApi.getFilterInstance(
          "profitPercent"
        );
        profitPercentFilterComponent.setModel(null);

        const result3TopFilterComponent = this.gridApi.getFilterInstance(
          "result3Top"
        );
        result3TopFilterComponent.setModel({
          type: "equals",
          filter: this.filterDirect3Top
        });
        const result2UnderFilterComponent = this.gridApi.getFilterInstance(
          "result2Under"
        );
        result2UnderFilterComponent.setModel({
          type: "equals",
          filter: this.filterDirect2Under
        });
        this.gridApi.onFilterChanged();
      }
    },
    onClearClicked() {
      this.filterValue = null;
      this.filterDiff = null;
      this.filterDirect3Top = null;
      this.filterDirect2Under = null;
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setFilterModel(null);
    },
    onCalculateClicked() {
      this.$EventBus.$emit("showLoading");
      getSimulate(this.$route.params.id, true).then(() => {
        this.onClearClicked();
        this.$EventBus.$emit("hideLoading");
      });
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
