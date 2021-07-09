<template>
  <v-row>
    <v-col class="py-0">
      <v-card class="my-0">
        <v-card-title class="subheading font-weight-bold">
          <v-icon left color="success"> mdi-account-check </v-icon>
          {{ $t("auditing") }}</v-card-title
        >
        <v-divider></v-divider>

        <v-stepper
          :vertical="false"
          alt-labels
          :value="step"
          class="elevation-0"
        >
          <v-stepper-header>
            <v-stepper-step step="1" class="pb-0">
              {{ $t("take") }}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="2" class="pb-0">
              {{ $t("audit") }}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" class="pb-0">
              {{ $t("completed") }}
            </v-stepper-step>
          </v-stepper-header>
        </v-stepper>

        <v-scale-transition v-if="step === 1">
          <div>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <strong>{{ $t("auditing_by") }}</strong>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  {{ transaction.adminUsername || "-" }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <template v-if="transaction.type === 'DEPOSIT'">
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <strong>{{ $t("company-bank-name") }}</strong>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{
                      transaction.companyBankAccount.bank[
                        getLangBankNameKeyFromLocale(locale)
                      ] || "-"
                    }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <strong>{{ $t("company-bank-no") }}</strong>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{
                      bankAccountCodeFormatter.apply(
                        transaction.companyBankAccount.accountCode
                      ) || "-"
                    }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </template>

            <v-row class="px-4">
              <v-col class="pt-0">
                <v-btn
                  :color="transaction.adminUsername ? 'warning' : 'info'"
                  block
                  :disabled="
                    !transaction._id ||
                    ['IN_PROGRESS', 'WITHDRAWAL'].includes(transaction.status)
                  "
                  @click="onBookingClicked"
                >
                  <v-icon left>mdi-eye-circle</v-icon>
                  <strong>{{ $t("take") }}</strong></v-btn
                ></v-col
              >
            </v-row>
          </div>
        </v-scale-transition>

        <v-scale-transition v-if="step === 2">
          <validation-observer ref="observer">
            <v-list dense>
              <template v-if="transaction.type === 'WITHDRAWAL'">
                <v-list-item>
                  <v-list-item-content>
                    <strong>{{ $t("withdraw_from") }}</strong>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    <CompanyBankAccountDropdownWithValidation
                      v-model="comapanyBank"
                      :name="$t('withdraw_from')"
                      :label="$t('withdraw_from')"
                      rules="required"
                      type="PAY"
                    />
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-else-if="transaction.type === 'DEPOSIT'">
                <v-list-item>
                  <v-list-item-content>
                    <strong>{{ $t("company-bank-name") }}</strong>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{
                      transaction.companyBankAccount.bank[
                        getLangBankNameKeyFromLocale(locale)
                      ] || "-"
                    }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <strong>{{ $t("company-bank-no") }}</strong>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{
                      bankAccountCodeFormatter.apply(
                        transaction.companyBankAccount.accountCode
                      ) || "-"
                    }}
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-list-item>
                <v-list-item-content>
                  <strong>{{ $t("fee") }}</strong>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <v-text-field
                    v-model="fee"
                    :label="$t('fee')"
                    type="number"
                    hide-details
                  />
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <strong>{{ $t("reject-reason") }}</strong>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <RejectReasonDropdown
                    v-model="rejectReason"
                    :label="$t('reject-reason')"
                  />
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <strong>{{ $t("remark") }}</strong>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <v-textarea
                    v-model="remark"
                    :label="$t('remark')"
                    hide-details
                  />
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-row class="px-4">
              <v-col class="pt-0">
                <v-btn
                  color="success"
                  :disabled="transaction && transaction.wasRejected"
                  block
                  @click="onApproveClicked"
                >
                  <v-icon left>mdi-check-circle</v-icon>
                  <strong>{{ $t("approve") }}</strong></v-btn
                ></v-col
              >
              <v-col class="pt-0">
                <v-btn color="primary" block @click="onRejectClicked">
                  <v-icon left>mdi-close-circle</v-icon>
                  <strong>{{ $t("reject") }}</strong></v-btn
                >
              </v-col>
            </v-row>
          </validation-observer>
        </v-scale-transition>

        <v-scale-transition v-if="step === 3">
          <div>
            <v-list dense>
              <v-list-item v-for="item in auditItem" :key="item.key">
                <v-list-item-content>
                  <strong>{{ $t(item.key) }}</strong>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  {{ item.value }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-scale-transition>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { get } from "vuex-pathify";
import { withValidation } from "vee-validate";

import { updatePaymentById } from "@/api/payment.js";

import { getTransactionStatusByKey } from "@/utils/TransactionStatusFormatter.js";
import { bankAccountCodeFormatter } from "@/utils/StringMask.js";

import RejectReasonDropdown from "@/views/transaction/components/RejectReasonDropdown";
import CompanyBankAccountDropdown from "@/components/CompanyBankAccountDropdown.vue";

const CompanyBankAccountDropdownWithValidation = withValidation(
  CompanyBankAccountDropdown
);

import { getLangBankNameKeyFromLocale } from "@/utils/LocaleUtil";
Object.freeze(getLangBankNameKeyFromLocale);

export default {
  components: {
    RejectReasonDropdown,
    CompanyBankAccountDropdownWithValidation
  },
  props: {
    transaction: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    bankAccountCodeFormatter,
    getLangBankNameKeyFromLocale,
    step: 1,
    auditItem: [],
    rejectReason: "",
    remark: "",
    fee: 0,
    comapanyBank: null
  }),
  computed: {
    me: get("auth/me"),
    locale: get("global/locale")
  },
  watch: {
    transaction(transaction) {
      if (transaction.adminUsername === this.me.username) {
        this.step = 2;
      } else {
        this.step = 1;
      }
      this.rejectReason = "";
      this.remark = transaction.remark;
      this.fee = 0;
    }
  },
  methods: {
    bookingTransaction(override) {
      const req = {
        status: "IN_REVIEW",
        override
      };

      updatePaymentById(this.transaction._id, req)
        .then(res => {
          this.step = 2;
        })
        .catch(err => {
          if (err.response && err.response.data.data.code === 5001) {
            this.$Toastr.error(
              this.$t(err.response.data.data.message, [
                err.response.data.data.data.adminUsername
              ])
            );
          } else if (err.response && err.response.data.data.code === 5002) {
            this.$Toastr.error(
              this.$t(err.response.data.data.message, [
                err.response.data.data.data.status
              ])
            );
          } else {
            this.$Toastr.error(this.$t(err.toString()));
          }

          this.$EventBus.$emit("onTransactionRefresh");
        });
    },
    onBookingClicked() {
      if (this.transaction.adminUsername) {
        this.$Swal
          .fire({
            title: this.$t("are_you_sure"),
            html: this.$t("take_audit_warning", [
              this.transaction.adminUsername
            ]),
            icon: "warning",
            showCancelButton: true
          })
          .then(result => {
            if (result.value) {
              this.bookingTransaction(true);
            }
          });
      } else {
        this.bookingTransaction();
      }
    },
    async onApproveClicked() {
      const result = await this.$refs.observer.validate();
      if (result) {
        const req = {
          status: "APPROVED",
          remark: this.remark,
          fee: this.fee
        };

        if (this.transaction.type === "WITHDRAWAL") {
          req.companyBankAccountId = this.comapanyBank._id;
        }

        updatePaymentById(this.transaction._id, req)
          .then(res => {
            this.step = 3;
            this.setAuditItem(res);
          })
          .catch(err => {
            if (err.response && err.response.data.data.code === 5001) {
              this.$Toastr.error(
                this.$t(err.response.data.data.message, [
                  err.response.data.data.data.adminUsername
                ])
              );
            } else if (err.response && err.response.data.data.code === 5002) {
              this.$Toastr.error(
                this.$t(err.response.data.data.message, [
                  err.response.data.data.data.status
                ])
              );
            } else if (err.response && err.response.data.data.code === 5003) {
              this.$Toastr.error(this.$t(err.response.data.data.message));
            } else {
              this.$Toastr.error(this.$t(err.toString()));
            }
            this.$EventBus.$emit("onTransactionRefresh");
          });
      }
    },
    onRejectClicked() {
      if (!this.rejectReason) {
        this.$Swal.fire(
          this.$t("warning"),
          this.$t("please_select_reject_reason"),
          this.$t("warning")
        );
        return;
      }

      const req = {
        status: "REJECTED",
        rejectReason: this.rejectReason,
        remark: this.remark,
        fee: this.fee
      };

      updatePaymentById(this.transaction._id, req)
        .then(res => {
          this.step = 3;
          this.setAuditItem(res);
        })
        .catch(err => {
          if (err.response && err.response.data.data.code === 5001) {
            this.$Toastr.error(
              this.$t(err.response.data.data.message, [
                err.response.data.data.data.adminUsername
              ])
            );
          } else if (err.response && err.response.data.data.code === 5002) {
            this.$Toastr.error(
              this.$t(err.response.data.data.message, [
                err.response.data.data.data.status
              ])
            );
          } else {
            this.$Toastr.error(this.$t(err.toString()));
          }
          this.$EventBus.$emit("onTransactionRefresh");
        });
    },
    setAuditItem(res) {
      this.auditItem = [
        {
          key: "status",
          value: getTransactionStatusByKey(res.status)
        },
        {
          key: "audited_by",
          value: res.adminUsername
        },
        {
          key: "audited_date",
          value: this.$Moment(res.updatedAt).format("L HH:mm:ss")
        },
        {
          key: "fee",
          value: this.$Numeral(res.fee).format("0,0.00")
        },
        {
          key: "reject-reason",
          value: res.rejectReason || "-"
        },
        {
          key: "remark",
          value: res.remark || "-"
        }
      ];
    }
  }
};
</script>
