<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("member_setting") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("member_setting_subtitle") }}
            </div>
          </template>

          <div class="pt-2 pb-5">
            <v-card class="my-0">
              <v-card-title class="subheading font-weight-bold">
                <v-icon left color="success"> mdi-plus-circle </v-icon>
                {{ $t("member_setting_subtitle") }}</v-card-title
              >
              <v-divider></v-divider>
              <v-row class="d-flex justify-center pt-10 pb-10">
                <v-col cols="12" md="6">
                  <validation-observer ref="observer">
                    <v-container class="py-0">
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('minimum_deposit')"
                        rules="min_value:0"
                      >
                        <v-text-field
                          v-model.number="minDeposit"
                          type="number"
                          :label="$t('minimum_deposit')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-cash-100</v-icon>
                          <span slot="append">฿</span></v-text-field
                        >
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('minimum_withdrawal')"
                        rules="min_value:0"
                      >
                        <v-text-field
                          v-model.number="minWithdrawal"
                          type="number"
                          :label="$t('minimum_withdrawal')"
                          :error-messages="errors"
                          ><v-icon slot="prepend">mdi-cash-100</v-icon>
                          <span slot="append">฿</span></v-text-field
                        >
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        :name="
                          $t(
                            'minimum_withdrawal_percent_by_total_amount_and_total_deposit'
                          )
                        "
                        rules="required|min_value:0"
                      >
                        <v-text-field
                          v-model.number="
                            minWithdrawalPercentByTotalAmountAndTotalDeposit
                          "
                          :label="
                            $t(
                              'minimum_withdrawal_percent_by_total_amount_and_total_deposit'
                            )
                          "
                          :error-messages="errors"
                          ><v-icon slot="prepend"
                            >mdi-brightness-percent</v-icon
                          >
                          <v-icon slot="append"
                            >mdi-percent-outline</v-icon
                          ></v-text-field
                        >
                      </validation-provider>
                      <fieldset
                        class="pa-3"
                        style="border: 1px solid #ccc; border-radius: 8px"
                      >
                        <legend class="font-weight-light text--primary">
                          {{ $t("user-bank-account") }}
                        </legend>
                        <v-switch
                          v-model="openCloseAutoApproveUserBankAccount"
                          :label="$t('open_close_auto_approve_bank')"
                        ></v-switch>
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('maximum_user_bank_accounts')"
                          rules="min_value:1"
                        >
                          <v-text-field
                            v-model.number="maxUserBankAccounts"
                            :label="$t('maximum_user_bank_accounts')"
                            :error-messages="errors"
                          >
                            <v-icon slot="prepend"
                              >account_balance</v-icon
                            ></v-text-field
                          >
                        </validation-provider>
                      </fieldset>
                      <fieldset
                        class="pa-3 mt-5"
                        style="border: 1px solid #ccc; border-radius: 8px"
                      >
                        <legend class="font-weight-light text--primary">
                          {{ $t("open_close_deposit") }}
                        </legend>
                        <v-switch
                          v-model="openCloseDeposit"
                          :label="openCloseDeposit ? $t('open') : $t('close')"
                        ></v-switch>
                        <validation-provider
                          v-if="!openCloseDeposit"
                          v-slot="{ errors }"
                          :name="$t('close_text')"
                          rules="required"
                        >
                          <v-textarea
                            v-model="closeDepositText"
                            :label="$t('close_text')"
                            :error-messages="errors"
                          />
                        </validation-provider>
                        <v-switch
                          v-model="openCloseDepositTime"
                          :label="$t('open_close_time')"
                        ></v-switch>
                        <v-switch
                          v-if="openCloseDepositTime"
                          v-model="openCloseDepositOverTime"
                          :label="$t('open_close_manual_time')"
                        ></v-switch>
                        <v-dialog
                          ref="openDepositTimeDialog"
                          v-model="openDepositTimeModal"
                          :return-value.sync="openDepositTime"
                          :disabled="!openCloseDepositTime"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="openDepositTime"
                              :label="$t('open_deposit_time')"
                              prepend-icon="access_time"
                              readonly
                              :disabled="!openCloseDepositTime"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="openDepositTimeModal"
                            v-model="openDepositTime"
                            format="24hr"
                            full-width
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="openDepositTimeModal = false"
                              >{{ $t("cancel") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.openDepositTimeDialog.save(
                                  openDepositTime
                                )
                              "
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-time-picker>
                        </v-dialog>
                        <v-dialog
                          ref="closeDepositTimeDialog"
                          v-model="closeDepositTimeModal"
                          :return-value.sync="closeDepositTime"
                          :disabled="!openCloseDepositTime"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="closeDepositTime"
                              :label="$t('close_deposit_time')"
                              prepend-icon="access_time"
                              readonly
                              :disabled="!openCloseDepositTime"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="closeDepositTimeModal"
                            v-model="closeDepositTime"
                            format="24hr"
                            full-width
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="closeDepositTimeModal = false"
                              >{{ $t("cancel") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.closeDepositTimeDialog.save(
                                  closeDepositTime
                                )
                              "
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-time-picker>
                        </v-dialog>
                      </fieldset>
                      <fieldset
                        class="pa-3 mt-5"
                        style="border: 1px solid #ccc; border-radius: 8px"
                      >
                        <legend class="font-weight-light text--primary">
                          {{ $t("open_close_withdrawal") }}
                        </legend>
                        <v-switch
                          v-model="openCloseWithdrawal"
                          :label="
                            openCloseWithdrawal ? $t('open') : $t('close')
                          "
                        ></v-switch>
                        <validation-provider
                          v-if="!openCloseWithdrawal"
                          v-slot="{ errors }"
                          :name="$t('close_text')"
                          rules="required"
                        >
                          <v-textarea
                            v-model="closeWithdrawalText"
                            :label="$t('close_text')"
                            :error-messages="errors"
                          />
                        </validation-provider>
                        <v-switch
                          v-model="openCloseWithdrawalTime"
                          :label="$t('open_close_time')"
                        ></v-switch>
                        <v-switch
                          v-if="openCloseWithdrawalTime"
                          v-model="openCloseWithdrawalOverTime"
                          :label="$t('open_close_manual_time')"
                        ></v-switch>
                        <v-dialog
                          ref="openWithdrawalTimeDialog"
                          v-model="openWithdrawalTimeModal"
                          :return-value.sync="openWithdrawalTime"
                          persistent
                          :disabled="!openCloseWithdrawalTime"
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="openWithdrawalTime"
                              :label="$t('open_withdrawal_time')"
                              prepend-icon="access_time"
                              readonly
                              :disabled="!openCloseWithdrawalTime"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="openWithdrawalTimeModal"
                            v-model="openWithdrawalTime"
                            format="24hr"
                            full-width
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="openWithdrawalTimeModal = false"
                              >{{ $t("cancel") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.openWithdrawalTimeDialog.save(
                                  openWithdrawalTime
                                )
                              "
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-time-picker>
                        </v-dialog>
                        <v-dialog
                          ref="closeWithdrawalTimeDialog"
                          v-model="closeWithdrawalTimeModal"
                          :return-value.sync="closeWithdrawalTime"
                          persistent
                          :disabled="!openCloseWithdrawalTime"
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="closeWithdrawalTime"
                              :label="$t('close_withdrawal_time')"
                              prepend-icon="access_time"
                              readonly
                              :disabled="!openCloseWithdrawalTime"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="closeWithdrawalTimeModal"
                            v-model="closeWithdrawalTime"
                            format="24hr"
                            full-width
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="closeWithdrawalTimeModal = false"
                              >{{ $t("cancel") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.closeWithdrawalTimeDialog.save(
                                  closeWithdrawalTime
                                )
                              "
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-time-picker>
                        </v-dialog>
                      </fieldset>
                      <fieldset
                        class="pa-3 mt-5"
                        style="border: 1px solid #ccc; border-radius: 8px"
                      >
                        <legend class="font-weight-light text--primary">
                          {{ $t("open_close_withdrawal_affliate") }}
                        </legend>
                        <v-switch
                          v-model="openCloseWithdrawalAffiliate"
                          :label="
                            openCloseWithdrawalAffiliate
                              ? $t('open')
                              : $t('close')
                          "
                        ></v-switch>
                        <validation-provider
                          v-if="!openCloseWithdrawalAffiliate"
                          v-slot="{ errors }"
                          :name="$t('close_text')"
                          rules="required"
                        >
                          <v-textarea
                            v-model="closeWithdrawalAffiliateText"
                            :label="$t('close_text')"
                            :error-messages="errors"
                          />
                        </validation-provider>
                      </fieldset>
                      <fieldset
                        class="pa-3 mt-5"
                        style="border: 1px solid #ccc; border-radius: 8px"
                      >
                        <legend class="font-weight-light text--primary">
                          {{ $t("bet_headline") }}
                        </legend>
                        <v-switch
                          v-model="openCloseCancelOrderInAnotherDay"
                          :label="$t('open_close_cancel_order_in_another_day')"
                        ></v-switch>
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('limit_cancel_order_per_day')"
                        >
                          <v-text-field
                            v-model.number="limitCancelOrderPerDay"
                            type="number"
                            :label="$t('limit_cancel_order_per_day')"
                            :error-messages="errors"
                          >
                            <v-icon slot="prepend"
                              >mdi-trash-can-outline</v-icon
                            >
                          </v-text-field>
                        </validation-provider>
                      </fieldset>
                      <v-divider class="mt-2" />

                      <v-row>
                        <v-col class="pb-0">
                          <v-btn
                            type="submit"
                            color="success"
                            block
                            @click="onSubmitClicked"
                            ><v-icon left>save</v-icon
                            ><strong>{{ $t("save") }}</strong></v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </validation-observer>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getSetting, saveSetting } from "@/api/setting";

export default {
  data: () => ({
    minDeposit: null,
    minWithdrawal: null,
    minWithdrawalPercentByTotalAmountAndTotalDeposit: 0,

    openCloseAutoApproveUserBankAccount: false,
    maxUserBankAccounts: null,

    openCloseDeposit: false,
    closeDepositText: null,
    openCloseDepositTime: false,
    openCloseDepositOverTime: false,
    openDepositTimeModal: false,
    openDepositTime: null,
    closeDepositTimeModal: false,
    closeDepositTime: null,

    openCloseWithdrawal: false,
    closeWithdrawalText: null,
    openCloseWithdrawalTime: false,
    openCloseWithdrawalOverTime: false,
    openWithdrawalTimeModal: false,
    openWithdrawalTime: null,
    closeWithdrawalTimeModal: false,
    closeWithdrawalTime: null,
    openCloseWithdrawalAffiliate: false,
    closeWithdrawalAffiliateText: null,

    openCloseCancelOrderInAnotherDay: false,
    limitCancelOrderPerDay: null
  }),
  created() {
    this.initial();
  },
  methods: {
    async initial() {
      this.setting = await getSetting();
      this.minDeposit = this.setting.minDeposit;
      this.minWithdrawal = this.setting.minWithdrawal;
      this.minWithdrawalPercentByTotalAmountAndTotalDeposit = this.setting.minWithdrawalPercentByTotalAmountAndTotalDeposit;

      this.openCloseAutoApproveUserBankAccount = this.setting.openCloseAutoApproveUserBankAccount;
      this.maxUserBankAccounts = this.setting.maxUserBankAccounts;

      this.openCloseDeposit = this.setting.openCloseDeposit;
      this.closeDepositText = this.setting.closeDepositText;
      this.openCloseDepositTime = this.setting.openCloseDepositTime;
      this.openCloseDepositOverTime = this.setting.openCloseDepositOverTime;
      this.openDepositTime = this.setting.openDepositTime;
      this.closeDepositTime = this.setting.closeDepositTime;
      this.openCloseWithdrawal = this.setting.openCloseWithdrawal;
      this.closeWithdrawalText = this.setting.closeWithdrawalText;
      this.openCloseWithdrawalTime = this.setting.openCloseWithdrawalTime;
      this.openCloseWithdrawalOverTime = this.setting.openCloseWithdrawalOverTime;
      this.openWithdrawalTime = this.setting.openWithdrawalTime;
      this.closeWithdrawalTime = this.setting.closeWithdrawalTime;
      this.openCloseWithdrawalAffiliate = this.setting.openCloseWithdrawalAffiliate;
      this.closeWithdrawalAffiliateText = this.setting.closeWithdrawalAffiliateText;

      this.openCloseCancelOrderInAnotherDay = this.setting.openCloseCancelOrderInAnotherDay;
      this.limitCancelOrderPerDay = this.setting.limitCancelOrderPerDay;
    },
    async onSubmitClicked() {
      if (!this.setting) {
        return;
      }
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }
      try {
        let minDeposit = null;
        let minWithdrawal = null;
        if (this.minDeposit !== null && this.minDeposit !== "") {
          minDeposit = this.minDeposit;
        }
        if (this.minWithdrawal !== null && this.minWithdrawal !== "") {
          minWithdrawal = this.minWithdrawal;
        }
        if (!this.maxUserBankAccounts) {
          this.maxUserBankAccounts = null;
        }
        let limitCancelOrderPerDay = null;
        if (this.limitCancelOrderPerDay !== "") {
          limitCancelOrderPerDay = this.limitCancelOrderPerDay;
        }
        await saveSetting(this.setting._id.toString(), {
          minDeposit,
          minWithdrawal,
          minWithdrawalPercentByTotalAmountAndTotalDeposit: this
            .minWithdrawalPercentByTotalAmountAndTotalDeposit,
          openCloseAutoApproveUserBankAccount: this
            .openCloseAutoApproveUserBankAccount,
          maxUserBankAccounts: this.maxUserBankAccounts,

          openCloseDeposit: this.openCloseDeposit,
          closeDepositText: this.closeDepositText,
          openCloseDepositTime: this.openCloseDepositTime,
          openCloseDepositOverTime: this.openCloseDepositOverTime,
          openDepositTime: this.openDepositTime,
          closeDepositTime: this.closeDepositTime,
          openCloseWithdrawal: this.openCloseWithdrawal,
          closeWithdrawalText: this.closeWithdrawalText,
          openCloseWithdrawalTime: this.openCloseWithdrawalTime,
          openCloseWithdrawalOverTime: this.openCloseWithdrawalOverTime,
          openWithdrawalTime: this.openWithdrawalTime,
          closeWithdrawalTime: this.closeWithdrawalTime,
          openCloseWithdrawalAffiliate: this.openCloseWithdrawalAffiliate,
          closeWithdrawalAffiliateText: this.closeWithdrawalAffiliateText,

          openCloseCancelOrderInAnotherDay: this
            .openCloseCancelOrderInAnotherDay,
          limitCancelOrderPerDay: limitCancelOrderPerDay
        });
        this.$Swal.fire(
          this.$t("info"),
          this.$t("edit_setting_success"),
          "success"
        );
      } catch (error) {
        this.$Swal.fire(
          this.$t("error3"),
          this.$t("edit_setting_error"),
          "error"
        );
      }
    }
  }
};
</script>
