<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("bet-detail") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("bet_detail_subtitle") }}
            </div>
          </template>

          <validation-observer ref="observer">
            <v-form @submit.prevent="onSubmit">
              <v-container>
                <v-row>
                  <v-radio-group
                    v-model="filterOption"
                    row
                    class="pa-0 ma-0 pl-3 filter-dates"
                    hide-details
                  >
                    <span class="pr-2 my-auto">{{ $t("filter_by") }}</span>
                    <v-dialog
                      ref="filterDatesDialog"
                      v-model="filterDatesModal"
                      :return-value.sync="filterDates"
                      persistent
                      width="320px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateRangeText"
                          :label="$t('date')"
                          prepend-icon="event"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="filterDates"
                        scrollable
                        range
                        :locale="locale"
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="filterDatesModal = false"
                          >{{ $t("cancel") }}</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="onFilterDatesChange(filterDates)"
                          >{{ $t("ok") }}</v-btn
                        >
                      </v-date-picker>
                    </v-dialog>
                  </v-radio-group>
                </v-row>
                <v-row>
                  <v-col class="py-0">
                    <v-radio-group
                      v-model="filterOption"
                      row
                      class="pa-0 ma-0"
                      hide-details
                    >
                      <span class="pr-2 my-auto">{{ $t("status") }}</span>
                      <div>
                        <OrderStatusDropdownWithValidation
                          v-model="filterStatus"
                          vid="status"
                          :name="$t('status')"
                          :label="$t('status')"
                          rules="required"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{ $t("username") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterUsername"
                          :label="$t('username')"
                          type="text"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{ $t("type") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterProductName"
                          :label="$t('type')"
                          type="text"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{ $t("product_type") }}</span>
                      <div>
                        <LottoTypeDropdown
                          v-model="filterType"
                          :label="$t('product_type')"
                          icon=""
                          all
                        />
                      </div>
                      <span class="mx-2 my-auto">{{ $t("product2") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterLottoName"
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
                  >{{ $t("order_list") }}</span
                >
                <ag-grid-vue
                  style="height: 300px;"
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
                <br />
                <AffiliateTable :order="currentOrder" />
              </v-container>
            </v-form>
          </validation-observer>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";
import { withValidation } from "vee-validate";
import OrderItemTable from "@/views/product/components/OrderItemTable";
import AffiliateTable from "@/views/report/components/AffiliateTable";
import BlankPinnedRowCellRenderer from "@/components/BlankPinnedRowCellRenderer";
import OrderStatusDropdown from "@/components/OrderStatusDropdown";
import LottoTypeDropdown from "@/components/LottoTypeDropdown";

const OrderStatusDropdownWithValidation = withValidation(OrderStatusDropdown);

import { getOrderLottoTable, getSumOrders } from "@/api/orderLotto";

import PlayerMemberId from "@/views/report/grid/PlayerMemberId";
import OrderStatus from "@/views/report/grid/OrderStatus";
import ProductType from "@/views/report/grid/ProductType";
import { columnDefs } from "@/views/report/grid/OrderColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "ReportBet",
  components: {
    AgGridVue,
    OrderItemTable,
    AffiliateTable,
    OrderStatusDropdownWithValidation,
    LottoTypeDropdown,
    /* eslint-disable */
    AgGridHeaderI18n,
    OrderStatus,
    ProductType,
    PlayerMemberId
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,
    currentOrder: "",
    pinnedBottomRow: [],
    frameworkComponents: null,

    filterDatesModal: false,
    filterDates: [],
    filterUsername: null,
    filterProductName: null,
    filterType: null,
    filterLottoName: null,
    filterStatus: ["WAITING", "FINISHED"]
  }),
  computed: {
    dateRangeText() {
      return this.filterDates.join(" ~ ");
    },
    locale: get("global/locale")
  },
  created() {
    this.frameworkComponents = {
      blankPinnedRowCellRenderer: BlankPinnedRowCellRenderer
    };
    this.$EventBus.$on("onBetRefresh", this.onBetRefresh);

    this.filterDates = [
      this.$Moment().startOf("month").format("YYYY-MM-DD"),
      this.$Moment().endOf("month").format("YYYY-MM-DD")
    ];
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onBetRefresh", this.onBetRefresh);
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged(locale) {
      if (locale === "th") {
        this.columnApi.setColumnsVisible(["productThaiName"], true);
        this.columnApi.setColumnsVisible(["productName"], false);
        this.columnApi.setColumnsVisible(["lottoThaiName"], true);
        this.columnApi.setColumnsVisible(["lottoName"], false);
      } else {
        this.columnApi.setColumnsVisible(["productThaiName"], false);
        this.columnApi.setColumnsVisible(["productName"], true);
        this.columnApi.setColumnsVisible(["lottoThaiName"], false);
        this.columnApi.setColumnsVisible(["lottoName"], true);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default lang
      this.onLocaleChanged();

      // default sort
      this.columnApi.getColumn("createdAt").setSort("desc");

      // default filter
      this.gridApi.setFilterModel({
        status: {
          type: "contains",
          filter: this.filterStatus.join(",")
        },
        createdAt: {
          type: "equals",
          filter:
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0)
              .format() +
            "," +
            this.$Moment(this.filterDates[1], "YYYY-MM-DD")
              .hours(23)
              .minutes(59)
              .seconds(59)
              .milliseconds(999)
              .format()
        }
      });

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getOrderLottoTable(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel
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

          getSumOrders(params.filterModel)
            .then(res => {
              this.pinnedBottomRow = [
                {
                  _id: "รวม",
                  totalAmount: res.totalAmount,
                  totalDiscount: res.totalDiscount,
                  totalNet: res.totalNet,
                  totalReward: res.totalReward,
                  totalProfit: res.totalProfit
                }
              ];
            })
            .catch(err => {
              this.pinnedBottomRow = [
                {
                  _id: "รวม",
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
    onFilterDatesChange(filterDates) {
      const newFilterDates = this.$_.sortBy(filterDates);
      this.filterDates = newFilterDates;
      this.$refs.filterDatesDialog.save(newFilterDates);
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
      if (this.filterDates.length > 0) {
        let filterValue = "";
        if (this.filterDates.length === 2) {
          filterValue +=
            "," +
            this.$Moment(this.filterDates[1], "YYYY-MM-DD")
              .hours(23)
              .minutes(59)
              .seconds(59)
              .milliseconds(999)
              .format();
        } else {
          filterValue =
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0)
              .format() +
            "," +
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(23)
              .minutes(59)
              .seconds(59)
              .milliseconds(999)
              .format();
        }
        filter["createdAt"] = {
          type: "equals",
          filter: filterValue
        };
      } else {
        if (filter.createdAt) {
          delete filter.createdAt;
        }
      }
      if (this.filterStatus.length > 0) {
        filter["status"] = {
          type: "contains",
          filter: this.filterStatus.join(",")
        };
      } else {
        if (filter.status) {
          delete filter.status;
        }
      }
      if (this.filterUsername) {
        filter["user"] = {
          type: "contains",
          filter: this.filterUsername
        };
      } else {
        if (filter["user"]) {
          delete filter["user"];
        }
      }
      if (this.filterProductName) {
        filter["productThaiName"] = {
          type: "contains",
          filter: this.filterProductName
        };
      } else {
        if (filter["productThaiName"]) {
          delete filter["productThaiName"];
        }
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
      if (this.filterLottoName) {
        filter["lottoThaiName"] = {
          type: "contains",
          filter: this.filterLottoName
        };
      } else {
        if (filter["lottoThaiName"]) {
          delete filter["lottoThaiName"];
        }
      }

      // this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    },
    onBetRefresh() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
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
