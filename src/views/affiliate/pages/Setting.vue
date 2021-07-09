<template>
  <v-container id="user-profile" fluid tag="section">
    <template v-if="me.role.name === 'Partner'">
      <SettingDetails />
    </template>
    <template v-else-if="me.role.name === 'Modulator'">
      <v-row justify="center">
        <v-col>
          <base-material-card>
            <template v-slot:heading>
              <div class="display-2 font-weight-light">
                {{ $t("affiliate-bonus-setting") }}
              </div>

              <div class="subtitle-1 font-weight-light">
                {{ $t("affiliate_bonus_setting_subtitle") }}
              </div>
            </template>

            <v-card class="my-0" style="height: 50%;">
              <v-card-title class="subheading font-weight-bold">
                <v-icon left color="success">
                  mdi-plus-circle
                </v-icon>
                {{ $t("affiliate_bonus_setting_subtitle") }}
              </v-card-title>
              <v-divider></v-divider>
              <v-row class="d-flex justify-center">
                <v-col cols="12" md="6">
                  <validation-observer ref="observer">
                    <v-container class="py-0">
                      <strong>{{ $t("invited") }}</strong>
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('entrance_bonus')"
                        rules="required"
                      >
                        <v-text-field
                          v-model.number="invitedShare"
                          type="number"
                          :label="$t('entrance_bonus')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-cash-100</v-icon>
                          <span slot="append">฿</span>
                        </v-text-field>
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('minimum_deposit_to_get_the_bonus')"
                        rules="required"
                      >
                        <v-text-field
                          v-model.number="invitedMinDeposit"
                          type="number"
                          :label="$t('minimum_deposit_to_get_the_bonus')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-cash-100</v-icon>
                          <span slot="append">฿</span>
                        </v-text-field>
                      </validation-provider>

                      <strong>{{ $t("debit") }}</strong>
                      <validation-provider
                        v-slot="{ errors }"
                        vid="debitMinWithdrawal"
                        :name="$t('minimum_withdrawal')"
                        rules="required"
                      >
                        <v-text-field
                          v-model.number="debitMinWithdrawal"
                          type="number"
                          :label="$t('minimum_withdrawal')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-cash-100</v-icon>
                          <span slot="append">฿</span>
                        </v-text-field>
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        vid="debitMinAmountToWithdrawal"
                        :name="$t('minimum_bet_to_withdraw')"
                        rules="required"
                      >
                        <v-text-field
                          v-model.number="debitMinAmountToWithdrawal"
                          type="number"
                          :label="$t('minimum_bet_to_withdraw')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-cash-100</v-icon>
                          <span slot="append">฿</span>
                        </v-text-field>
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        vid="debitPercentShare"
                        :name="$t('percentage')"
                        rules="required"
                      >
                        <v-text-field
                          v-model.number="debitPercentShare"
                          type="number"
                          :label="`${$t('level')} 1`"
                          :placeholder="$t('percentage')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-brightness-percent</v-icon>
                          <v-icon slot="append">mdi-percent-outline</v-icon>
                        </v-text-field>
                      </validation-provider>

                      <strong>{{ $t("credit") }}</strong>
                      <validation-provider
                        v-slot="{ errors }"
                        vid="creditMinWithdrawal"
                        :name="$t('minimum_withdrawal')"
                        rules="required"
                      >
                        <v-text-field
                          v-model.number="creditMinWithdrawal"
                          type="number"
                          :label="$t('minimum_withdrawal')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-cash-100</v-icon>
                          <span slot="append">฿</span>
                        </v-text-field>
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        vid="creditMinAmountToWithdrawal"
                        :name="$t('minimum_bet_to_withdraw')"
                        rules="required"
                      >
                        <v-text-field
                          v-model.number="creditMinAmountToWithdrawal"
                          type="number"
                          :label="$t('minimum_bet_to_withdraw')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-cash-100</v-icon>
                          <span slot="append">฿</span>
                        </v-text-field>
                      </validation-provider>
                      <template v-for="num in 7">
                        <validation-provider
                          :key="num"
                          v-slot="{ errors }"
                          :vid="`creditPercentShares${num}`"
                          :name="$t('percentage')"
                          rules="required"
                        >
                          <v-text-field
                            v-model.number="creditPercentShares[num]"
                            type="number"
                            :label="`${$t('level')} ${num}`"
                            :placeholder="$t('percentage')"
                            :error-messages="errors"
                          >
                            <v-icon slot="prepend"
                              >mdi-brightness-percent</v-icon
                            >
                            <v-icon slot="append">mdi-percent-outline</v-icon>
                          </v-text-field>
                        </validation-provider>
                      </template>

                      <p class="text-end">
                        <strong
                          >{{ $t("total_credit") }}
                          {{ getSumCredit() }} %</strong
                        >
                      </p>

                      <v-divider class="mt-2" />

                      <v-row>
                        <v-col v-if="!main || add" class="pb-0">
                          <v-btn
                            type="button"
                            color="grey"
                            block
                            :loading="processing"
                            @click="onResetClicked"
                            ><v-icon left>refresh</v-icon
                            ><strong>{{ $t("reset_factory") }}</strong></v-btn
                          >
                        </v-col>
                        <v-col class="pb-0">
                          <v-btn
                            type="submit"
                            color="success"
                            block
                            :loading="processing"
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
          </base-material-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import SettingDetails from "@/views/affiliate/pages/SettingDetails";
import {
  getAffiliateConfigs,
  saveAffiliateConfigs
} from "@/api/affiliateConfig";
import { getSetting, saveSetting } from "@/api/setting";
export default {
  name: "AffiliateBonusSetting",
  components: {
    SettingDetails
  },
  data: () => ({
    processing: false,

    invitedShare: 0,
    invitedMinDeposit: 0,
    debitMinWithdrawal: 0,
    debitMinAmountToWithdrawal: 0,
    debitPercentShare: 0,
    creditMinWithdrawal: 0,
    creditMinAmountToWithdrawal: 0,
    creditPercentShares: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    },

    configs: null,
    setting: null
  }),
  computed: {
    me: get("auth/me")
  },
  created() {
    this.initial();
  },
  methods: {
    async initial() {
      this.configs = await getAffiliateConfigs();
      this.setting = await getSetting();

      this.debitMinWithdrawal = this.setting.minAffiliateDebitWithdrawal;
      this.debitMinAmountToWithdrawal = this.setting.minAffiliateDebitAmountToWithdrawal;
      this.creditMinWithdrawal = this.setting.minAffiliateCreditWithdrawal;
      this.creditMinAmountToWithdrawal = this.setting.minAffiliateCreditAmountToWithdrawal;
      this.invitedMinDeposit = this.setting.minAffiliateInvitedDeposit;

      this.$_.forEach(this.configs, config => {
        if (config.type === "DISCOUNTED" && config.userType === "DEBIT") {
          this.debitPercentShare = config.percentShare * 100;
        } else if (
          config.type === "DISCOUNTED" &&
          config.userType === "CREDIT"
        ) {
          this.creditPercentShares[config.level] = Number(
            (config.percentShare * 100).toFixed(2)
          );
        } else if (config.type === "INVITED") {
          this.invitedShare = config.percentShare;
        }
      });
    },
    getSumCredit() {
      let result = 0;
      this.$_.forOwn(this.creditPercentShares, c => {
        result += c;
      });
      return this.$Numeral(result).format("0,0.00");
    },
    onResetClicked() {
      this.processing = true;

      this.initial().then(() => {
        this.processing = false;
      });
    },
    async onSubmitClicked() {
      let validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }

      this.processing = true;
      const settingData = {
        minAffiliateDebitWithdrawal: this.debitMinWithdrawal,
        minAffiliateDebitAmountToWithdrawal: this.debitMinAmountToWithdrawal,
        minAffiliateCreditWithdrawal: this.creditMinWithdrawal,
        minAffiliateCreditAmountToWithdrawal: this.creditMinAmountToWithdrawal,
        minAffiliateInvitedDeposit: this.invitedMinDeposit
      };

      const affiliateConfigsData = [];
      affiliateConfigsData.push({
        userType: "DEBIT",
        type: "INVITED",
        percentShare: this.invitedShare
      });
      affiliateConfigsData.push({
        userType: "DEBIT",
        type: "DISCOUNTED",
        level: 1,
        percentShare: Number((this.debitPercentShare / 100).toFixed(2))
      });
      this.$_.forOwn(this.creditPercentShares, (percentShare, level) => {
        affiliateConfigsData.push({
          userType: "CREDIT",
          type: "DISCOUNTED",
          level: Number(level),
          percentShare: Number((percentShare / 100).toFixed(2))
        });
      });
      saveSetting(this.setting._id.toString(), settingData)
        .then(() => {
          saveAffiliateConfigs(affiliateConfigsData)
            .then(() => {
              this.processing = false;
              this.$Swal.fire(
                this.$t("info"),
                this.$t("edit_affiliate_setting_success"),
                "success"
              );
            })
            .catch(err => {
              this.processing = false;
              this.$Swal.fire(
                this.$t("error3"),
                this.$t("edit_affiliate_setting_error"),
                "error"
              );
            });
        })
        .catch(err => {
          this.processing = false;
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("edit_affiliate_setting_error"),
            "error"
          );
        });
    }
  }
};
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
