<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("company-bank-account") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("company_bank_account_subtitle") }}
                </div></v-col
              >
              <v-col class="py-0 text-right">
                <v-btn
                  v-if="me.role.name === 'Modulator'"
                  fab
                  small
                  :loading="fetching"
                  :disabled="fetching"
                  color="green"
                  class="mr-2"
                  @click="onAddClicked"
                >
                  <v-icon large>mdi-plus-circle</v-icon>
                </v-btn>
                <v-btn
                  v-if="me.role.name === 'Modulator'"
                  fab
                  small
                  :loading="fetching"
                  :disabled="fetching"
                  color="warning"
                  class="mr-2"
                  @click="onEditClicked"
                >
                  <v-icon large>mdi-circle-edit-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="me.role.name === 'Modulator'"
                  fab
                  small
                  :loading="fetching"
                  :disabled="fetching"
                  color="primary"
                  @click="onRemoveClicked"
                >
                  <v-icon large>mdi-minus-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <div style="height: auto">
            <ag-grid-vue
              style="height: 600px"
              class="ag-theme-alpine pt-2"
              row-selection="single"
              :grid-options="gridOptions"
              :get-row-node-id="getRowNodeId"
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
              @cell-focused="onFocused"
              @grid-ready="onGridReady"
            />
            <v-scale-transition>
              <div v-if="showFrom" class="pt-2">
                <v-card class="my-0">
                  <v-card-title class="subheading font-weight-bold">
                    <v-icon
                      left
                      :color="mode === 'ADD' ? 'success' : 'warning'"
                    >
                      {{
                        mode === "ADD"
                          ? "mdi-plus-circle"
                          : "mdi-circle-edit-outline"
                      }}
                    </v-icon>
                    {{ mode === "ADD" ? $t("add") : $t("edit") }}
                    {{ $t("company-bank-account") }}</v-card-title
                  >
                  <v-divider></v-divider>

                  <validation-observer ref="observer">
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content>
                          <strong>{{ $t("status") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end pl-5">
                          <v-switch
                            v-model="active"
                            :label="`${$t('status')} ${
                              active ? $t('open') : $t('close')
                            }`"
                            hide-details
                          ></v-switch>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <strong>{{ $t("type") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-radio-group v-model="type" row hide-details>
                            <v-radio
                              :label="$t('pay_and_receive')"
                              value="BOTH"
                            />
                            <v-radio :label="$t('pay_only')" value="PAY" />
                            <v-radio
                              :label="$t('receive_only')"
                              value="RECEIVE"
                            />
                          </v-radio-group>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item v-if="mode === 'ADD'">
                        <v-list-item-content>
                          <strong>{{ $t("bank") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <BankDropdownWithValidation
                            v-model="bank"
                            :name="$t('bank')"
                            :label="$t('bank')"
                            rules="required"
                            hide-details
                          />
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <strong>{{ $t("full-name") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('full-name')"
                            rules="required|max:50"
                          >
                            <v-text-field
                              v-model="accountName"
                              :label="$t('full-name')"
                              :error-messages="errors"
                            >
                              <v-icon slot="prepend"
                                >perm_contact_calendar</v-icon
                              >
                            </v-text-field>
                          </validation-provider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <strong>{{ $t("bank_no") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('bank_no')"
                            vid="confirmation"
                            rules="required"
                          >
                            <v-text-field
                              v-model="accountCode"
                              v-mask="[
                                '###-#-#####-#',
                                '###-#-#####-##',
                                '###-#-#####-###',
                                '###-#-#####-####',
                                '###-#-#####-####-#'
                              ]"
                              type="text"
                              :label="$t('bank_no')"
                              :error-messages="errors"
                            >
                              <v-icon slot="prepend">credit_card</v-icon>
                            </v-text-field>
                          </validation-provider>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>
                          <strong>{{ $t("balance2") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <validation-provider
                            v-slot="{ errors }"
                            name="ยอดคงเหลือ"
                            rules="required"
                          >
                            <v-text-field
                              v-model.number="balance"
                              :label="$t('balance2')"
                              type="number"
                              :error-messages="errors"
                            >
                              <v-icon slot="prepend">money</v-icon>
                            </v-text-field>
                          </validation-provider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <strong>{{ $t("automatic") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end pl-5">
                          <v-switch
                            v-model="auto"
                            :label="`${$t('status')} ${
                              active ? $t('open') : $t('close')
                            }`"
                            hide-details
                          ></v-switch>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item v-if="auto">
                        <v-list-item-content>
                          <strong>{{ $t("bank_username") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('bank_username')"
                            rules="required"
                          >
                            <v-text-field
                              v-model="crewlerUsername"
                              :label="$t('bank_username')"
                              :error-messages="errors"
                            >
                              <v-icon slot="prepend">person</v-icon>
                            </v-text-field>
                          </validation-provider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item v-if="auto">
                        <v-list-item-content>
                          <strong>{{ $t("bank_password") }}</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('bank_password')"
                            rules="required"
                          >
                            <v-text-field
                              v-model="crewlerPassword"
                              type="password"
                              autocomplete="new-password"
                              :label="$t('bank_password')"
                              :error-messages="errors"
                            >
                              <v-icon slot="prepend">lock</v-icon>
                            </v-text-field>
                          </validation-provider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item v-if="auto">
                        <v-list-item-content>
                          <strong>Device ID</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Device ID"
                            rules="required"
                          >
                            <v-text-field
                              v-model="deviceId"
                              label="Device ID"
                              :error-messages="errors"
                            >
                              <v-icon slot="prepend"
                                >mdi-cellphone-android</v-icon
                              >
                            </v-text-field>
                          </validation-provider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item v-if="auto">
                        <v-list-item-content>
                          <strong>Refresh Token</strong>
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Refresh Token"
                            rules="required"
                          >
                            <v-text-field
                              v-model="refreshToken"
                              label="Refresh Token"
                              :error-messages="errors"
                            >
                              <v-icon slot="prepend">lock</v-icon>
                            </v-text-field>
                          </validation-provider>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </validation-observer>

                  <v-row class="px-4">
                    <v-col v-if="mode === 'ADD'" class="pt-0">
                      <v-btn
                        color="success"
                        :loading="loading"
                        block
                        @click="onSubmitClicked"
                      >
                        <v-icon left>mdi-check-circle</v-icon>
                        <strong>{{ $t("save") }}</strong></v-btn
                      ></v-col
                    >
                    <v-col v-else class="pt-0">
                      <v-btn
                        color="warning"
                        :loading="loading"
                        block
                        @click="onSubmitClicked"
                      >
                        <v-icon left>mdi-check-circle</v-icon>
                        <strong>{{ $t("save") }}</strong></v-btn
                      ></v-col
                    >
                    <v-col class="pt-0">
                      <v-btn block @click="onCancelClicked">
                        <v-icon left>mdi-make-circle</v-icon>
                        <strong>{{ $t("cancel") }}</strong></v-btn
                      ></v-col
                    >
                  </v-row>
                </v-card>
              </div>
            </v-scale-transition>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";
import {
  getCompanyBankAccounts,
  addCompanyBankAccounts,
  updateCompanyBankAccountsById
} from "@/api/companyBankAccount.js";
import { addCompanyBankAccountTransactions } from "@/api/companyBankAccountTransaction.js";

import { mask } from "vue-the-mask";
import { withValidation } from "vee-validate";
import BankDropdown from "@/components/BankDropdown";

import BankType from "@/views/finance/grid/BankType";
import Status from "@/views/finance/grid/Status";

import { columnDefs } from "@/views/finance/grid/CompanyBankColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

const BankDropdownWithValidation = withValidation(BankDropdown);

export default {
  name: "Company",
  directives: {
    mask
  },
  components: {
    AgGridVue,
    BankDropdownWithValidation,
    /* eslint-disable */
    AgGridHeaderI18n,
    BankType,
    Status
  },
  data: () => ({
    columnDefs: [],
    rowData: [],
    gridApi: null,
    columnApi: null,

    showFrom: false,

    active: true,
    type: "BOTH",
    bank: null,
    accountName: null,
    accountCode: null,
    balance: 0,
    auto: false,
    crewlerUsername: null,
    crewlerPassword: null,
    deviceId: null,
    refreshToken: null,

    currentFocused: {},
    mode: null,

    loading: false
  }),
  computed: {
    me: get("auth/me"),
    locale: get("global/locale")
  },
  watch: {
    currentFocused(currentFocused) {
      if (this.mode === "EDIT") {
        this.active = currentFocused.active;
        this.type = currentFocused.type;
        this.bank = currentFocused.bank;
        this.accountName = currentFocused.accountName;
        this.accountCode = currentFocused.accountCode;
        this.balance = currentFocused.balance;
      }
    }
  },
  created() {
    this.columnDefs = this.$_.cloneDeep(columnDefs);
    if (this.me.role.name !== "Modulator") {
      this.columnDefs[0].checkboxSelection = false;
    }
    this.gridOptions = {};
    this.fetchCompanyBankAccounts();
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
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

      this.onLocaleChanged(this.locale);
    },
    onFocused(event) {
      this.gridOptions.api.forEachNode(node => {
        if (event.rowIndex === node.rowIndex) {
          this.currentFocused = node.data;
          return;
        }
      });
      this.initialData(this.mode);
    },
    getRowNodeId(data) {
      return data._id;
    },
    resetForm() {
      this.$refs.observer.reset();
      this.active = true;
      this.type = "BOTH";
      this.bank = null;
      this.accountName = null;
      this.accountCode = null;
      this.balance = 0;
      this.auto = false;
      this.crewlerUsername = null;
      this.crewlerPassword = null;
      this.deviceId = null;
      this.refreshToken = null;
    },
    onAddClicked() {
      this.gridApi.deselectAll();

      this.mode = "ADD";
      this.showFrom = true;

      this.resetForm();
    },
    onEditClicked() {
      if (!this.currentFocused._id) {
        this.$Swal.fire(
          this.$t("warning"),
          this.$t("please_select_company_bank"),
          "warning"
        );
        return;
      }

      this.initialData("EDIT");
    },
    initialData(mode) {
      this.mode = mode;
      if (["ADD", "EDIT"].includes(this.mode)) {
        this.showFrom = true;
      }

      if (this.mode === "EDIT") {
        this.active = this.currentFocused.active;
        this.type = this.currentFocused.type;
        this.bank = this.currentFocused.bank;
        this.accountName = this.currentFocused.accountName;
        this.accountCode = this.currentFocused.accountCode;
        this.balance = this.currentFocused.balance;
        this.auto = this.currentFocused.auto;
        this.crewlerUsername = this.currentFocused.crewlerUsername;
        this.crewlerPassword = this.currentFocused.crewlerPassword;
        this.deviceId = this.currentFocused.deviceId;
        this.refreshToken = this.currentFocused.refreshToken;
      }
    },
    onRemoveClicked() {
      if (!this.currentFocused._id) {
        this.$Swal.fire(
          this.$t("warning"),
          this.$t("please_select_company_bank"),
          "warning"
        );
        return;
      }

      this.$Swal
        .fire({
          title: this.$t("are_you_sure"),
          html: this.$t("do_you_want_to_delete_company_account"),
          icon: "warning",
          showCancelButton: true
        })
        .then(result => {
          if (result.value) {
            const req = { status: "DELETED", active: false };
            updateCompanyBankAccountsById(this.currentFocused._id, req)
              .then(() => {
                this.$Toastr.success(this.$t("delete_company_account_success"));
                this.fetchCompanyBankAccounts();
              })
              .catch(() => {
                this.$Swal.fire(
                  this.$t("error3"),
                  this.$t("delete_company_account_error"),
                  "error"
                );
              });
          }
        });
    },
    onSubmitClicked() {
      const req = {
        active: this.active,
        type: this.type,
        bankId: this.bank._id,
        accountName: this.accountName,
        accountCode: this.accountCode.replace(/\-/g, ""),
        balance: this.balance,
        auto: this.auto,
        crewlerUsername: this.crewlerUsername,
        crewlerPassword: this.crewlerPassword,
        deviceId: this.deviceId,
        refreshToken: this.refreshToken
      };

      if (!this.loading && this.mode === "ADD") {
        this.loading = true;
        req.status = "WAITING";

        addCompanyBankAccounts(req)
          .then(async res => {
            const transactionReq = {
              status: "APPROVED",
              companyBankAccountId: res._id
            };
            await addCompanyBankAccountTransactions(transactionReq);
            this.fetchCompanyBankAccounts();
            this.showFrom = false;
            this.resetForm();
            this.$Toastr.success(this.$t("add_company_account_success"));
            this.loading = false;
          })
          .catch(err => {
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("add_company_account_error"),
              "error"
            );
            this.loading = false;
          });
      } else if (!this.loading && this.mode === "EDIT") {
        this.loading = true;
        updateCompanyBankAccountsById(this.currentFocused._id, req)
          .then(res => {
            this.fetchCompanyBankAccounts();
            this.showFrom = false;
            this.resetForm();
            this.$Toastr.success(this.$t("edit_company_account_success"));
            this.loading = false;
          })
          .catch(err => {
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("edit_company_account_error"),
              "error"
            );
            this.loading = false;
          });
      }
    },
    onCancelClicked() {
      this.mode = null;
      this.showFrom = false;
    },
    fetchCompanyBankAccounts() {
      const req = "?status_ne=DELETED";
      getCompanyBankAccounts(req).then(res => {
        this.rowData = res;
      });
    }
  }
};
</script>
