<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ lotto[getLangNameKeyFromLocale(locale)] }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("prize_results_at") }}
              {{ $Moment(lotto.resultedAt).format("D MMMM YYYY") }}
            </div>
          </template>

          <v-row>
            <a href="#" class="pl-5 pt-5 pb-5" @click="$router.back()">{{
              $t("back")
            }}</a>
          </v-row>

          <div class="pt-2">
            <validation-observer ref="observer">
              <v-card class="my-0" style="height: 50%;">
                <v-card-title class="subheading font-weight-bold">
                  <v-icon left color="success">
                    mdi-plus-circle
                  </v-icon>
                  {{ $t("prize_results_at") }}
                  {{
                    $Moment(lotto.resultedAt).format("D MMMM YYYY")
                  }}</v-card-title
                >
                <v-divider></v-divider>
                <v-row class="d-flex justify-center mx-2">
                  <v-col cols="8">
                    <strong>{{ $t("announce") }}</strong>
                  </v-col>
                  <v-col cols="4">
                    <v-row>
                      <v-col class="mt-2 text-right">{{
                        $t("prize_result")
                      }}</v-col>
                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('prize_result')"
                          rules="required"
                        >
                          <v-text-field
                            v-model="result"
                            class="pt-0 mt-0"
                            :label="$t('prize_result')"
                            name="result"
                            :error-messages="errors"
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                    <v-row v-for="type in lottoTypes" :key="type.key">
                      <v-col class="mt-2 text-right">{{
                        $t(type.key.toLowerCase())
                      }}</v-col>
                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          :vid="type.key"
                          :name="$t(type.key.toLowerCase())"
                          :rules="{
                            required: true
                          }"
                        >
                          <v-text-field
                            v-model="rates[type.key]"
                            class="pt-0 mt-0"
                            :label="$t(type.key.toLowerCase())"
                            :name="rates[type.key]"
                            :error-messages="errors"
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="mr-5 text-right red--text">
                    {{ $t("prize_remark") }}
                  </v-col>
                </v-row>
                <v-divider class="mt-2" />

                <v-row>
                  <v-col class="px-6" cols="12">
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
              </v-card>
            </validation-observer>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import {
  lottoTypes,
  getLottoTypeByKey,
  getLottoLengthByKey
} from "@/utils/LottoTypeFormatter.js";
import { getLottoById, calcLottoResultByLottoId } from "@/api/lotto.js";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
Object.freeze(getLangNameKeyFromLocale);

export default {
  data: () => ({
    getLangNameKeyFromLocale,
    lottoTypes: [],
    rates: {},
    lotto: {},
    result: null
  }),
  computed: {
    locale: get("global/locale")
  },
  watch: {
    "rates.DIRECT6TOP"(value) {
      if (value.length === 6) {
        this.rates.DIRECT3TOP = value.substring(3, 6);
        this.rates.DIRECT2TOP = value.substring(4, 6);
      } else {
        this.rates.DIRECT3TOP = null;
        this.rates.DIRECT2TOP = null;
      }
    }
  },
  created() {
    this.initial();
    this.$EventBus.$on("onLottoResult", this.onLottoResult);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLottoResult", this.onLottoResult);
  },
  methods: {
    getLottoTypeByKey,
    getLottoLengthByKey,
    async initial() {
      this.lottoTypes = [];

      const newLottoTypes = this.$_.cloneDeep(lottoTypes);
      delete newLottoTypes.DIRECTRESULT;

      const lotto = await getLottoById(this.$route.params.id);
      this.lotto = lotto;
      this.result = lotto.result;
      this.$_.forOwn(newLottoTypes, (obj, key) => {
        if (!key.startsWith("TOOD") && !key.startsWith("RUN")) {
          const convKey = this.getKey(key);
          if (lotto.productConfig[convKey + "Active"]) {
            this.lottoTypes.push({
              key: key,
              value: obj
            });
            const resultKey = convKey.replace("direct", "result");
            this.rates[key] = lotto[this.getKey(resultKey)];
          }
        }
      });
    },
    getKey(key) {
      if (key === "DIRECTRESULT") {
        return "directResult";
      }
      return this.$_.camelCase(key);
    },
    getDigits(key) {
      if (key.startsWith("RUN")) {
        return "1";
      }
      const matchs = key.match(/\d+/g);
      return matchs[0];
    },
    async onSubmitClicked() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }

      const result = await this.$Swal.fire({
        title: this.$t("are_you_sure_announce"),
        html: `<p>${this.$t("are_you_sure_announce_2")}</p>`,
        showCancelButton: true,
        focusCancel: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: this.$t("ok"),
        cancelButtonText: this.$t("cancel")
      });
      if (result.value) {
        const results = {
          result: this.result
        };
        this.$_.forOwn(this.rates, (value, key) => {
          const resultKey = key.replace("DIRECT", "RESULT");
          results[this.getKey(resultKey)] = value.replace(/ /g, "");
        });

        this.$EventBus.$emit("showLoading");
        calcLottoResultByLottoId(this.$route.params.id, results)
          .then(() => {
            this.$Swal.fire(
              this.$t("info"),
              this.$t("waiting_calculate_result"),
              "success"
            );
            this.$EventBus.$emit("hideLoading");
            this.$router.back();
          })
          .catch(error => {
            let message = this.$t("announce_error");
            if (
              error.response.status === 400 &&
              error.response.data.message === "not time to do this action"
            ) {
              message = this.$t("do_not_announce_for_this_time");
            }
            this.$Swal.fire(this.$t("error"), message, "error");
            this.$EventBus.$emit("hideLoading");
          });
      }
    },
    backOrRedirect() {
      const originRoute = { ...this.$route };
      this.$router.back();
      this.$nextTick(() => {
        if (this.$_.isEqual(originRoute, this.$route)) {
          // Redirect to the home path by default
          this.$router.replace("/");
        }
      });
    },
    async onLottoResult(data) {
      if (data.auto) {
        await this.$Swal.fire(
          this.$t("warning"),
          this.$t("lotto_result_auto_warning"),
          "warning"
        );
        this.backOrRedirect();
      } else {
        this.$Swal.fire(
          this.$t("warning"),
          this.$t("lotto_result_warning"),
          "warning"
        );
        this.initial();
      }
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
