<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("user-bank-account") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("member_bank_account_subtitle") }}
            </div>
          </template>

          <validation-observer ref="observer">
            <form @submit.prevent="onSubmit">
              <v-container class="pa-0">
                <v-row>
                  <v-col class="py-0">
                    <v-radio-group
                      v-model="filterOption"
                      row
                      class="pa-0 ma-0"
                      hide-details
                    >
                      <span class="pr-2 my-auto">{{ $t("filter_by") }}</span>
                      <div style="width: 350px;">
                        <UserBankStatusDropdownWithValidation
                          v-model="filterStatus"
                          :label="$t('status')"
                          :name="$t('status')"
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
                      <span class="mx-2 my-auto">{{ $t("bank_no") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterBankNo"
                          :label="$t('bank_no')"
                          type="text"
                        />
                      </div>
                      <v-btn type="submit" color="success" class="mx-2 my-auto">
                        <strong>{{ $t("search2") }}</strong>
                      </v-btn>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <div style="height: 69vh;">
                  <ag-grid-vue
                    style="height: 100%;"
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
                </div>
              </v-container>
            </form>
          </validation-observer>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { withValidation } from "vee-validate";
import { getUserBankAccounts } from "@/api/userBankAccount.js";
import UserBankStatusDropdown from "@/components/UserBankStatusDropdown";

const UserBankStatusDropdownWithValidation = withValidation(
  UserBankStatusDropdown
);

import BankId from "@/views/member/grid/BankId";
import MemberId from "@/views/member/grid/MemberId";
import BankAction from "@/views/member/grid/BankAction";
import Status from "@/views/member/grid/Status";

import { columnDefs } from "@/views/member/grid/MemberBankColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "Deposit",
  components: {
    AgGridVue,
    UserBankStatusDropdownWithValidation,
    /* eslint-disable */
    AgGridHeaderI18n,
    BankId,
    MemberId,
    BankAction,
    Status
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    filterStatus: null,
    filterUsername: null,
    filterBankNo: null
  }),
  created() {
    this.doRefreshGrid = false;
    this.worker = setInterval(() => {
      if (this.doRefreshGrid) {
        this.doRefreshGrid = false;
        this.onMemberBankRefresh();
      }
    }, 5000);
    this.$EventBus.$on(
      "onWebSocketUserBankAccount",
      this.onWebSocketUserBankAccount
    );
    this.$EventBus.$on("onMemberBankRefresh", this.onMemberBankRefresh);
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    if (this.worker) {
      clearInterval(this.worker);
    }
    this.$EventBus.$off(
      "onWebSocketUserBankAccount",
      this.onWebSocketUserBankAccount
    );
    this.$EventBus.$off("onMemberBankRefresh", this.onMemberBankRefresh);
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged(locale) {
      if (locale === "th") {
        this.columnApi.setColumnsVisible(["bank.thaiName"], true);
        this.columnApi.setColumnsVisible(["bank.name"], false);
      } else {
        this.columnApi.setColumnsVisible(["bank.thaiName"], false);
        this.columnApi.setColumnsVisible(["bank.name"], true);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default language
      this.onLocaleChanged(this.$i18n.locale);

      // default sort
      this.columnApi.getColumn("createdAt").setSort("desc");

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getUserBankAccounts(
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
        }
      });
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
        filter["username"] = {
          type: "contains",
          filter: this.filterUsername
        };
      } else {
        if (filter["username"]) {
          delete filter["username"];
        }
      }
      if (this.filterBankNo) {
        filter["accountCode"] = {
          type: "contains",
          filter: this.filterBankNo
        };
      } else {
        if (filter["accountCode"]) {
          delete filter["accountCode"];
        }
      }
      // this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
      // this.gridApi.onFilterChanged();
    },
    onMemberBankRefresh() {
      this.onSubmit();
    },
    onWebSocketUserBankAccount(data) {
      this.doRefreshGrid = true;
    }
  }
};
</script>
