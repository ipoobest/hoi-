<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("affiliate_bonus_setting_details") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("affiliate_bonus_setting_details_subtitle") }}
            </div>
          </template>

          <v-container class="py-0">
            <template v-if="me.role.name === 'Modulator'">
              <h2 class="mt-5">{{ $t("invited") }}</h2>
              <v-row no-gutters>
                <v-col cols="3" class="text-right">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3">{{ $t("entrance_bonus") }}</span>
                  </v-card>
                </v-col>
                <v-col cols="9">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3 font-weight-bold">{{
                      $Numeral(invitedShare).format("0,0.00")
                    }}</span>
                  </v-card>
                </v-col>
                <v-col cols="3" class="text-right">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3">{{
                      $t("minimum_deposit_to_get_the_bonus")
                    }}</span>
                  </v-card>
                </v-col>
                <v-col cols="9">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3 font-weight-bold">{{
                      $Numeral(invitedMinDeposit).format("0,0.00")
                    }}</span>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <h2 class="mt-5">{{ $t("debit") }}</h2>
            <v-row no-gutters>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{ $t("minimum_withdrawal") }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $Numeral(debitMinWithdrawal).format("0,0.00")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{
                    $t("minimum_bet_to_withdraw")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $Numeral(debitMinAmountToWithdrawal).format("0,0.00")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{ $t("level") }} 1</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold"
                    >{{ $Numeral(debitPercentShare).format("0,0.00") }} %</span
                  >
                </v-card>
              </v-col>
            </v-row>

            <h2 class="mt-5">{{ $t("credit") }}</h2>
            <v-row no-gutters>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{ $t("minimum_withdrawal") }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $Numeral(creditMinWithdrawal).format("0,0.00")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{
                    $t("minimum_bet_to_withdraw")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $Numeral(creditMinAmountToWithdrawal).format("0,0.00")
                  }}</span>
                </v-card>
              </v-col>
              <template v-for="num in 7">
                <v-col :key="num" cols="3" class="text-right">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3">{{ $t("level") }} {{ num }}</span>
                  </v-card>
                </v-col>
                <v-col :key="num" cols="9">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3 font-weight-bold"
                      >{{
                        $Numeral(creditPercentShares[num]).format("0,0.00")
                      }}
                      %</span
                    >
                  </v-card>
                </v-col>
              </template>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{ $t("total_credit") }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold"
                    >{{ $Numeral(getSumCredit()).format("0,0.00") }} %</span
                  >
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { getAffiliateConfigs } from "@/api/affiliateConfig";
import { getSetting } from "@/api/setting";
export default {
  name: "AffiliateBonusSetting",
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
