<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("bank-list") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("bank_list_subtitle") }}
                </div></v-col
              >
            </v-row>
          </template>

          <div style="height: 76vh">
            <ag-grid-vue
              :style="showFrom ? 'height: 48%;' : 'height: 100%;'"
              class="ag-theme-alpine pt-2"
              row-selection="single"
              :column-defs="columnDefs"
              :default-col-def="{
                sortable: true,
                resizable: true
              }"
              :row-data="rowData"
              :animate-rows="true"
              :suppress-drag-leave-hides-columns="true"
              :row-drag-managed="false"
              :floating-filter="false"
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
import { getBanks } from "@/api/bank.js";

import BankLogo from "@/views/finance/grid/BankLogo";
import Deprecate from "@/views/finance/grid/Deprecate";

import { columnDefs } from "@/views/finance/grid/BankColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "List",
  components: {
    AgGridVue,
    /* eslint-disable */
    BankLogo,
    Deprecate,
    AgGridHeaderI18n
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null
  }),
  computed: {
    locale: get("global/locale")
  },
  created() {
    this.fetchBanks();
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged(locale) {
      if (locale === "th") {
        this.columnApi.setColumnsVisible(["thaiName"], true);
        this.columnApi.setColumnsVisible(["niceName"], false);
      } else {
        this.columnApi.setColumnsVisible(["thaiName"], false);
        this.columnApi.setColumnsVisible(["niceName"], true);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.onLocaleChanged(this.locale);
    },
    fetchBanks() {
      getBanks().then(res => {
        this.rowData = res;
      });
    }
  }
};
</script>
