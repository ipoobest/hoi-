<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("product_details") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("product_details_subtitle") }}
            </div>
          </template>

          <v-row>
            <a href="#" class="pl-5 pt-5" @click="$router.back()">{{
              $t("back")
            }}</a>
          </v-row>

          <v-container v-if="productLotto" class="py-0">
            <v-row no-gutters>
              <v-col cols="2" class="text-right">
                <v-card class="pa-5" outlined tile>
                  <span class="text-h2">{{ $t("product_name") }}</span>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card class="pa-5" outlined tile>
                  <span class="text-h2 font-weight-bold">{{
                    productLotto[getLangNameKeyFromLocale(locale)]
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="2" class="text-right">
                <v-card class="pa-5" outlined tile>
                  <span class="text-h2">{{ $t("type") }}</span>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card class="pa-5" outlined tile>
                  <span class="text-h2 font-weight-bold">{{
                    productLotto.type === "STOCK"
                      ? $t("lotto_foreign_stock")
                      : $t("lotto2")
                  }}</span>
                </v-card>
              </v-col>
            </v-row>

            <h2 class="mt-5">{{ $t("general_setting") }}</h2>
            <v-row no-gutters>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $t("announced_time")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{ productLotto.resultedTime }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $t("end_time")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{ productLotto.endedTime }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $t("start_time")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{ productLotto.startedTime }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $t("open_play_before_end_date")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3">{{
                    productLotto.openPlayBeforeResultedAtInDays
                  }}</span>
                </v-card>
              </v-col>
              <template v-if="me.role.name === 'Modulator'">
                <v-col cols="3" class="text-right">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3 font-weight-bold">{{
                      $t("minimum_per_order")
                    }}</span>
                  </v-card>
                </v-col>
                <v-col cols="9">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3">{{
                      $Numeral(productLotto.minimumByRound).format("0,0")
                    }}</span>
                  </v-card>
                </v-col>
                <v-col cols="3" class="text-right">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3 font-weight-bold">{{
                      $t("maximum_per_order")
                    }}</span>
                  </v-card>
                </v-col>
                <v-col cols="9">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3">{{
                      $Numeral(productLotto.maximumByRound).format("0,0")
                    }}</span>
                  </v-card>
                </v-col>
              </template>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $t("total_risk")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $Numeral(totalRisk).format("0,0.00")
                  }}</span>
                </v-card>
              </v-col>
            </v-row>

            <h2 class="mt-5">{{ $t("rate") }}</h2>
            <v-row no-gutters>
              <v-col cols="2" class="text-left">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{ $t("type") }}</span>
                </v-card>
              </v-col>
              <v-col cols="1" class="text-center">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $t("status")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $t("minimum_per_type")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{
                    $t("maximum_per_number")
                  }}</span>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-card class="pa-5 ma-0" outlined tile>
                  <span class="text-h3 font-weight-bold">{{ $t("rate") }}</span>
                </v-card>
              </v-col>

              <template v-for="type in types">
                <v-col :key="type" cols="2" class="text-left">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3">{{ $t(type.toLowerCase()) }}</span>
                  </v-card>
                </v-col>
                <v-col :key="type" cols="1" class="text-center">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span
                      class="text-h3"
                      :class="[
                        { 'green--text': productLotto[type + 'Active'] },
                        { 'red--text': !productLotto[type + 'Active'] }
                      ]"
                      >{{
                        productLotto[type + "Active"] ? $t("open") : $t("close")
                      }}</span
                    >
                  </v-card>
                </v-col>
                <v-col :key="type" cols="3" class="text-right">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span v-if="productLotto.minimumByItems" class="text-h3">{{
                      $Numeral(productLotto.minimumByItems[type]).format(
                        "0,0.00"
                      )
                    }}</span>
                  </v-card>
                </v-col>
                <v-col :key="type" cols="3" class="text-right">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span
                      v-if="productLotto.maximumByNumbers"
                      class="text-h3"
                      >{{
                        $Numeral(productLotto.maximumByNumbers[type]).format(
                          "0,0.00"
                        )
                      }}</span
                    >
                  </v-card>
                </v-col>
                <v-col :key="type" cols="3" class="text-right">
                  <v-card class="pa-5 ma-0" outlined tile>
                    <span class="text-h3">{{
                      $Numeral(productLotto[type + "Rate"]).format("0,0.00")
                    }}</span>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-container>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { lottoTypes } from "@/utils/LottoTypeFormatter";
Object.freeze(lottoTypes);
import { get } from "vuex-pathify";
import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
import { getProductById } from "@/api/productLotto";
export default {
  data: () => ({
    getLangNameKeyFromLocale,
    productLotto: null,
    totalRisks: 0
  }),
  computed: {
    locale: get("global/locale"),
    me: get("auth/me"),
    totalRisk: function () {
      let totalRisk = 0;
      this.$_.forEach(this.productLotto.risks, r => {
        totalRisk += r.totalRisk;
      });
      return totalRisk;
    }
  },
  created() {
    const types = [];
    this.$_.forOwn(lottoTypes, (value, key) => {
      types.push(this.getKey(key));
    });
    if (this.me.role.name !== "Modulator") {
      this.$_.remove(types, t => t === "directResult");
    }
    this.types = types;
    this.initial();
  },
  methods: {
    getKey(key) {
      if (key === "DIRECTRESULT") {
        return "directResult";
      }
      return this.$_.camelCase(key);
    },
    initial() {
      getProductById(this.$route.params.id).then(res => {
        this.productLotto = res;
      });
    }
  }
};
</script>
