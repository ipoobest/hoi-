<template>
  <v-card class="my-0" style="height: 50%">
    <v-card-title class="subheading font-weight-bold">
      <v-icon left color="success"> mdi-plus-circle </v-icon>
      {{ $t("risk_setting") }}
    </v-card-title>
    <v-divider></v-divider>
    <v-row v-if="!main" class="d-flex justify-end text-right">
      <v-col cols="12" md="12" align-self="end">
        <v-chip class="ma-2" text-color="white" color="green">
          <h2>{{ $t(remainingTime) }}</h2>
        </v-chip>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="6">
        <validation-observer ref="observer">
          <v-container class="py-0">
            <!-- <validation-provider
              v-slot="{ errors }"
              name="ชื่อสินค้า"
              rules="required"
            > -->
            <v-text-field v-model="name" :label="$t('product_name')" readonly>
              <v-icon slot="prepend">mdi-gamepad-variant</v-icon>
            </v-text-field>
            <!-- </validation-provider> -->

            <LottoTypeDropdown
              v-model="type"
              :name="$t('product_type')"
              :label="$t('product_type')"
              rules="required"
              readonly
            />

            <validation-provider
              v-slot="{ errors }"
              :name="$t('minimum_per_order')"
              rules="min_value:0"
            >
              <v-text-field
                v-model.number="minimumByRound"
                type="number"
                :label="$t('minimum_per_order')"
                :error-messages="errors"
              >
                <v-icon slot="prepend">mdi-cancel</v-icon>
              </v-text-field>
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              :name="$t('maximum_per_order')"
              rules="min_value:0"
            >
              <v-text-field
                v-model.number="maximumByRound"
                type="number"
                :label="$t('maximum_per_order')"
                :error-messages="errors"
              >
                <v-icon slot="prepend">mdi-cancel</v-icon>
              </v-text-field>
            </validation-provider>

            <strong>{{ $t("auto_result") }}</strong>

            <validation-provider
              v-slot="{ errors }"
              :name="$t('auto_result')"
              vid="autoResult"
              rules="required"
            >
              <v-switch
                v-model="autoResult"
                class="my-2"
                :label="`${$t('status')} ${
                  autoResult ? $t('open') : $t('close')
                }`"
                :error-messages="errors"
              ></v-switch>
            </validation-provider>

            <template v-if="main">
              <strong>{{ $t("risk_setting") }}</strong>
              <validation-provider
                v-slot="{ errors }"
                :name="$t('risk_setting')"
                rules="required_if:autoResult"
              >
                <v-text-field
                  v-model="resultRatePercent"
                  v-validate="'required'"
                  :label="$t('expected_percentage')"
                  data-vv-name="productName"
                  :disabled="!autoResult"
                  :error-messages="errors"
                >
                  <v-icon slot="prepend">mdi-brightness-percent</v-icon>
                </v-text-field>
              </validation-provider>
            </template>
            <template v-else>
              <template v-if="autoResult">
                <strong>{{ $t("risk_setting") }}</strong>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('risk_setting')"
                  rules="required_if:autoResult"
                >
                  <v-text-field
                    v-model="resultRatePercent"
                    v-validate="'required'"
                    :label="$t('expected_percentage')"
                    data-vv-name="productName"
                    :disabled="!autoResult"
                    :error-messages="errors"
                  >
                    <v-icon slot="prepend">mdi-brightness-percent</v-icon>
                  </v-text-field>
                </validation-provider>
              </template>
              <template v-else>
                <strong>{{ $t("force_result") }}</strong>
                <br />
                <br />
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('direct3top')"
                  rules="required_if:autoResult,false|digits:3"
                >
                  <v-text-field
                    v-model="locks.direct3Top"
                    class="pt-0 mt-0"
                    maxlength="3"
                    :label="$t('direct3top')"
                    :error-messages="errors"
                  />
                  <br />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('direct2under')"
                  rules="required_if:autoResult,false|digits:2"
                >
                  <v-text-field
                    v-model="locks.direct2Under"
                    class="pt-0 mt-0"
                    maxlength="2"
                    :label="$t('direct2under')"
                    :error-messages="errors"
                  />
                  <br />
                </validation-provider>
              </template>
            </template>
            <br />

            <strong>{{ $t("yeekee_shoot_reward") }}</strong>
            <v-switch
              v-model="yeekee1st16thActive"
              class="pt-5"
              :label="`${$t('status')} ${
                yeekee1st16thActive ? $t('open') : $t('close')
              }`"
              :disabled="!autoResult"
            ></v-switch>
            <p class="text--disabled">
              {{ $t("close") }} - {{ $t("yeekee_shoot_no_one_got_reward") }}
            </p>
            <p class="text--disabled">
              {{ $t("open") }} - {{ $t("yeekee_shoot_normaly") }}
            </p>
            <v-row>
              <v-col class="mt-2">{{ $t("rank") }} 1</v-col>
              <v-col class="mt-0"> </v-col>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('rate')"
                  :rules="`required`"
                >
                  <v-text-field
                    v-model.number="at1stRate"
                    type="number"
                    class="pt-0 mt-0"
                    :label="$t('rate')"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mt-2">{{ $t("rank") }} 16</v-col>
              <v-col class="mt-0"> </v-col>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('rate')"
                  :rules="`required`"
                >
                  <v-text-field
                    v-model.number="at16thRate"
                    type="number"
                    class="pt-0 mt-0"
                    :label="$t('rate')"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <strong>{{ $t("lotto_type_and_payment_rate") }}</strong>
            <v-row
              v-for="(key, index) in Object.keys(lottoRateTypes)"
              :key="index"
            >
              <v-col class="mt-2">{{ $t(key.toLowerCase()) }}</v-col>
              <v-col class="mt-0">
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('status')"
                  :vid="key"
                  rules="required"
                >
                  <v-switch
                    v-model="status[$_.camelCase(key)]"
                    class="mt-0"
                    :label="`${$t('status')} ${
                      status[$_.camelCase(key)] ? $t('open') : $t('close')
                    }`"
                    :error-messages="errors"
                  ></v-switch>
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('minimum_per_type')"
                >
                  <v-text-field
                    v-model.number="minimumByItems[getKey(key)]"
                    type="number"
                    class="pt-0 mt-0"
                    :label="$t('minimum_per_type')"
                    :disabled="!status[getKey(key)]"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('maximum_per_type')"
                >
                  <v-text-field
                    v-model.number="maximumByItems[getKey(key)]"
                    type="number"
                    class="pt-0 mt-0"
                    :label="$t('maximum_per_type')"
                    :disabled="!status[getKey(key)]"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('maximum_per_number')"
                >
                  <v-text-field
                    v-model.number="maximumByNumbers[getKey(key)]"
                    type="number"
                    class="pt-0 mt-0"
                    :label="$t('maximum_per_number')"
                    :disabled="!status[getKey(key)]"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('rate')"
                  :rules="`required_if:${key}`"
                >
                  <v-text-field
                    v-model.number="rates[$_.camelCase(key)]"
                    type="number"
                    class="pt-0 mt-0"
                    :label="$t('rate')"
                    :disabled="!status[$_.camelCase(key)]"
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
            </v-row>
            <v-divider class="mt-2" />

            <v-row>
              <v-col v-if="!main" class="pb-0">
                <v-btn
                  type="button"
                  color="grey"
                  block
                  :disabled="!main && lotto.finished"
                  @click="onResetProductClicked"
                  ><v-icon left>refresh</v-icon
                  ><strong>{{ $t("reset_factory") }}</strong></v-btn
                >
              </v-col>
              <v-col v-if="!main" class="pb-0">
                <v-btn
                  type="button"
                  color="warning"
                  block
                  :disabled="!main && lotto.finished"
                  @click="onCloneProductClicked"
                  ><v-icon left>get_app</v-icon
                  ><strong>{{ $t("reset_to_default") }}</strong></v-btn
                >
              </v-col>
              <v-col class="pb-0">
                <v-btn
                  type="submit"
                  color="success"
                  block
                  :disabled="!main && lotto.finished"
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
</template>

<script>
import LottoTypeDropdown from "@/components/LottoTypeDropdown.vue";
import { lottoTypes, getLottoTypeByKey } from "@/utils/LottoTypeFormatter.js";
import { getProductById, updateProductLottoById } from "@/api/productLotto.js";
import {
  getLottoById,
  updateLottoById,
  updateLottoByProductId
} from "@/api/lotto.js";
import { getSystemTime } from "@/api/system.js";

export default {
  components: {
    LottoTypeDropdown
  },
  props: {
    main: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    lottoTypes,
    lottoRateTypes: [],
    product: null,
    lotto: {},
    name: null,
    type: null,
    autoResult: true,
    resultRatePercent: null,
    status: {
      direct3Top: null,
      tood3Top: null,
      direct2Top: null,
      direct2Under: null,
      run3Top: null,
      run2Under: null
    },
    rates: {
      direct3Top: null,
      tood3Top: null,
      direct2Top: null,
      direct2Under: null,
      run3Top: null,
      run2Under: null
    },
    locks: {
      direct3Top: null,
      direct2Under: null
    },
    yeekee1st16thActive: false,
    at1stRate: null,
    at16thRate: null,
    remainingTime: "processing",

    minimumByRound: null,
    maximumByRound: null,
    minimumByItems: {
      direct3Top: null,
      direct3Under: null,
      tood3Top: null,
      direct2Top: null,
      direct2Under: null,
      run3Top: null,
      run2Under: null,
      direct3Front: null,
      directResult: null,
      toodResult: null
    },
    maximumByItems: {
      direct3Top: null,
      direct3Under: null,
      tood3Top: null,
      direct2Top: null,
      direct2Under: null,
      run3Top: null,
      run2Under: null,
      direct3Front: null,
      directResult: null,
      toodResult: null
    },
    maximumByNumbers: {
      direct3Top: null,
      direct3Under: null,
      tood3Top: null,
      direct2Top: null,
      direct2Under: null,
      run3Top: null,
      run2Under: null,
      direct3Front: null,
      directResult: null,
      toodResult: null
    }
  }),
  watch: {
    autoResult(value) {
      if (!value) {
        this.yeekee1st16thActive = false;
      }
    }
  },
  created() {
    this.initial();
  },
  beforeDestroy() {
    if (this.worker) {
      clearInterval(this.worker);
      this.worker = null;
    }
  },
  methods: {
    getLottoTypeByKey,
    async initial() {
      this.lottoRateTypes = this.$_.cloneDeep(lottoTypes);
      delete this.lottoRateTypes.DIRECT3FRONT;
      delete this.lottoRateTypes.DIRECT3UNDER;
      delete this.lottoRateTypes.TOOD2TOP;
      delete this.lottoRateTypes.RUN2TOP;
      delete this.lottoRateTypes.DIRECTRESULT;

      if (this.main) {
        this.product = await getProductById(this.$route.params.id);
      } else {
        this.lotto = await getLottoById(this.$route.params.id);
        this.product = this.lotto.productConfig;

        getSystemTime().then(time => {
          const now = this.$Moment(this.systemTime);
          const startedAt = this.$Moment(this.lotto.startedAt);
          const endedAt = this.$Moment(this.lotto.endedAt);
          if (now.isAfter(startedAt) && now.isBefore(endedAt)) {
            this.createWorker(now);
          } else {
            this.remainingTime = "times_up";
          }
        });
      }
      this.initialData(this.product);
    },
    createWorker(now) {
      if (this.worker) {
        clearInterval(worker);
        this.worker = null;
      }
      const startedAt = this.$Moment(this.lotto.startedAt);
      const endedAt = this.$Moment(this.lotto.endedAt);
      const startCount = now.subtract(1, "seconds");

      let remainingTime = this.$Moment
        .duration(endedAt.diff(startCount))
        .as("milliseconds");

      this.worker = setInterval(() => {
        remainingTime -= 1000;
        this.remainingTime = this.$Moment.utc(remainingTime).format("HH:mm:ss");
        if (remainingTime <= 0) {
          clearInterval(this.worker);
          this.worker = null;
          this.lotto.finished = true;
          this.remainingTime = "times_up";
        }
      }, 1000);
    },
    initialData(product) {
      this.name = product.name;
      this.type = product.type;
      this.autoResult = product.autoResult;
      this.resultRatePercent = product.resultRatePercent;

      this.status.direct3Top = product.direct3TopActive;
      this.status.direct3Under = product.direct3UnderActive;
      this.status.tood3Top = product.tood3TopActive;
      this.status.direct2Top = product.direct2TopActive;
      this.status.direct2Under = product.direct2UnderActive;
      this.status.run3Top = product.run3TopActive;
      this.status.run2Under = product.run2UnderActive;

      this.rates.direct3Top = product.direct3TopRate;
      this.rates.direct3Under = product.direct3UnderRate;
      this.rates.tood3Top = product.tood3TopRate;
      this.rates.direct2Top = product.direct2TopRate;
      this.rates.direct2Under = product.direct2UnderRate;
      this.rates.run3Top = product.run3TopRate;
      this.rates.run2Under = product.run2UnderRate;

      this.yeekee1st16thActive = product.yeekee1st16thActive;
      this.at1stRate = product.at1stRate;
      this.at16thRate = product.at16thRate;

      this.minimumByRound = product.minimumByRound;
      this.maximumByRound = product.maximumByRound;

      if (product.minimumByItems) {
        this.minimumByItems.direct3Top = product.minimumByItems.direct3Top;
        this.minimumByItems.direct3Under = product.minimumByItems.direct3Under;
        this.minimumByItems.tood3Top = product.minimumByItems.tood3Top;
        this.minimumByItems.direct2Top = product.minimumByItems.direct2Top;
        this.minimumByItems.direct2Under = product.minimumByItems.direct2Under;
        this.minimumByItems.run3Top = product.minimumByItems.run3Top;
        this.minimumByItems.run2Under = product.minimumByItems.run2Under;
        this.minimumByItems.direct3Front = product.minimumByItems.direct3Front;
        this.minimumByItems.directResult = product.minimumByItems.directResult;
        this.minimumByItems.toodResult = product.minimumByItems.toodResult;
      }
      if (product.maximumByItems) {
        this.maximumByItems.direct3Top = product.maximumByItems.direct3Top;
        this.maximumByItems.direct3Under = product.maximumByItems.direct3Under;
        this.maximumByItems.tood3Top = product.maximumByItems.tood3Top;
        this.maximumByItems.direct2Top = product.maximumByItems.direct2Top;
        this.maximumByItems.direct2Under = product.maximumByItems.direct2Under;
        this.maximumByItems.run3Top = product.maximumByItems.run3Top;
        this.maximumByItems.run2Under = product.maximumByItems.run2Under;
        this.maximumByItems.direct3Front = product.maximumByItems.direct3Front;
        this.maximumByItems.directResult = product.maximumByItems.directResult;
        this.maximumByItems.toodResult = product.maximumByItems.toodResult;
      }
      if (product.maximumByNumbers) {
        this.maximumByNumbers.direct3Top = product.maximumByNumbers.direct3Top;
        this.maximumByNumbers.direct3Under =
          product.maximumByNumbers.direct3Under;
        this.maximumByNumbers.tood3Top = product.maximumByNumbers.tood3Top;
        this.maximumByNumbers.direct2Top = product.maximumByNumbers.direct2Top;
        this.maximumByNumbers.direct2Under =
          product.maximumByNumbers.direct2Under;
        this.maximumByNumbers.run3Top = product.maximumByNumbers.run3Top;
        this.maximumByNumbers.run2Under = product.maximumByNumbers.run2Under;
        this.maximumByNumbers.direct3Front =
          product.maximumByNumbers.direct3Front;
        this.maximumByNumbers.directResult =
          product.maximumByNumbers.directResult;
        this.maximumByNumbers.toodResult = product.maximumByNumbers.toodResult;
      }

      if (!this.main) {
        this.locks.direct3Top = this.lotto.result3Top;
        this.locks.direct2Under = this.lotto.result2Under;

        this.minimumByRound = this.lotto.minimumByRound;
        this.maximumByRound = this.lotto.maximumByRound;

        if (lotto.minimumByItems) {
          this.minimumByItems.direct3Top = lotto.minimumByItems.direct3Top;
          this.minimumByItems.direct3Under = lotto.minimumByItems.direct3Under;
          this.minimumByItems.tood3Top = lotto.minimumByItems.tood3Top;
          this.minimumByItems.direct2Top = lotto.minimumByItems.direct2Top;
          this.minimumByItems.direct2Under = lotto.minimumByItems.direct2Under;
          this.minimumByItems.run3Top = lotto.minimumByItems.run3Top;
          this.minimumByItems.run2Under = lotto.minimumByItems.run2Under;
          this.minimumByItems.direct3Front = lotto.minimumByItems.direct3Front;
          this.minimumByItems.directResult = lotto.minimumByItems.directResult;
          this.minimumByItems.toodResult = lotto.minimumByItems.toodResult;
        }
        if (lotto.maximumByItems) {
          this.maximumByItems.direct3Top = lotto.maximumByItems.direct3Top;
          this.maximumByItems.direct3Under = lotto.maximumByItems.direct3Under;
          this.maximumByItems.tood3Top = lotto.maximumByItems.tood3Top;
          this.maximumByItems.direct2Top = lotto.maximumByItems.direct2Top;
          this.maximumByItems.direct2Under = lotto.maximumByItems.direct2Under;
          this.maximumByItems.run3Top = lotto.maximumByItems.run3Top;
          this.maximumByItems.run2Under = lotto.maximumByItems.run2Under;
          this.maximumByItems.direct3Front = lotto.maximumByItems.direct3Front;
          this.maximumByItems.directResult = lotto.maximumByItems.directResult;
          this.maximumByItems.toodResult = lotto.maximumByItems.toodResult;
        }
        if (lotto.maximumByNumbers) {
          this.maximumByNumbers.direct3Top = lotto.maximumByNumbers.direct3Top;
          this.maximumByNumbers.direct3Under =
            lotto.maximumByNumbers.direct3Under;
          this.maximumByNumbers.tood3Top = lotto.maximumByNumbers.tood3Top;
          this.maximumByNumbers.direct2Top = lotto.maximumByNumbers.direct2Top;
          this.maximumByNumbers.direct2Under =
            lotto.maximumByNumbers.direct2Under;
          this.maximumByNumbers.run3Top = lotto.maximumByNumbers.run3Top;
          this.maximumByNumbers.run2Under = lotto.maximumByNumbers.run2Under;
          this.maximumByNumbers.direct3Front =
            lotto.maximumByNumbers.direct3Front;
          this.maximumByNumbers.directResult =
            lotto.maximumByNumbers.directResult;
          this.maximumByNumbers.toodResult = lotto.maximumByNumbers.toodResult;
        }
      }
    },
    getKey(key) {
      if (key === "DIRECTRESULT") {
        return "directResult";
      }
      return this.$_.camelCase(key);
    },
    async onCloneProductClicked() {
      const product = await getProductById(
        this.lotto.productConfig._id.toString()
      );
      this.initialData(product);
    },
    async onResetProductClicked() {
      this.initialData(this.product);
    },
    async onSubmitClicked() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }
      let req = {};
      let minimumByRound = null;
      if (this.minimumByRound) {
        minimumByRound = this.minimumByRound;
      }
      let maximumByRound = null;
      if (this.minimumByRound) {
        maximumByRound = this.maximumByRound;
      }
      if (this.main) {
        req = {
          autoResult: this.autoResult,
          resultRatePercent: this.resultRatePercent,
          direct3TopActive: this.status.direct3Top,
          direct3UnderActive: this.status.direct3Under,
          tood3TopActive: this.status.tood3Top,
          direct2TopActive: this.status.direct2Top,
          direct2UnderActive: this.status.direct2Under,
          run3TopActive: this.status.run3Top,
          run2UnderActive: this.status.run2Under,

          direct3TopRate: this.rates.direct3Top,
          direct3UnderRate: this.rates.direct3Under,
          tood3TopRate: this.rates.tood3Top,
          direct2TopRate: this.rates.direct2Top,
          direct2UnderRate: this.rates.direct2Under,
          run3TopRate: this.rates.run3Top,
          run2UnderRate: this.rates.run2Under,

          yeekee1st16thActive: this.yeekee1st16thActive,
          at1stRate: this.at1stRate,
          at16thRate: this.at16thRate,

          minimumByRound: minimumByRound,
          maximumByRound: maximumByRound,
          minimumByItems: this.minimumByItems,
          maximumByItems: this.maximumByItems,
          maximumByNumbers: this.maximumByNumbers
        };

        try {
          const result = await this.$Swal.fire({
            title: this.$t("do_you_want_to_update_all_product"),
            html: this.$t("answer_do_you_want_to_update_all_product"),
            showCancelButton: true,
            focusCancel: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: this.$t("yes"),
            cancelButtonText: this.$t("no")
          });
          await updateProductLottoById(this.$route.params.id, req);

          if (result.value) {
            await updateLottoByProductId(this.$route.params.id, {
              minimumByRound: minimumByRound,
              maximumByRound: maximumByRound,
              minimumByItems: this.minimumByItems,
              maximumByItems: this.maximumByItems,
              maximumByNumbers: this.maximumByNumbers,
              productConfig: {
                ...this.product,
                ...req
              }
            });
            this.$Swal.fire(
              this.$t("info"),
              this.$t("edit_all_product_success"),
              "success"
            );
          } else {
            this.$Swal.fire(
              this.$t("info"),
              this.$t("edit_product_success"),
              "success"
            );
          }
          this.$router.back();
        } catch (error) {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("edit_product_error"),
            "error"
          );
        }
      } else {
        const result = {};
        if (!this.autoResult) {
          result.result3Top = this.locks.direct3Top;
          result.result2Top = this.locks.direct3Top.substring(1, 3);
          result.result2Under = this.locks.direct2Under;
        }
        let minimumByRound = null;
        if (this.minimumByRound) {
          minimumByRound = this.minimumByRound;
        }
        let maximumByRound = null;
        if (this.minimumByRound) {
          maximumByRound = this.maximumByRound;
        }
        req = {
          ...result,
          minimumByRound: minimumByRound,
          maximumByRound: maximumByRound,
          minimumByItems: this.minimumByItems,
          maximumByItems: this.maximumByItems,
          maximumByNumbers: this.maximumByNumbers,
          productConfig: {
            ...this.product,
            autoResult: this.autoResult,
            resultRatePercent: this.resultRatePercent,
            direct3TopActive: this.status.direct3Top,
            direct3UnderActive: this.status.direct3Under,
            tood3TopActive: this.status.tood3Top,
            direct2TopActive: this.status.direct2Top,
            direct2UnderActive: this.status.direct2Under,
            run3TopActive: this.status.run3Top,
            run2UnderActive: this.status.run2Under,

            direct3TopRate: this.rates.direct3Top,
            direct3UnderRate: this.rates.direct3Under,
            tood3TopRate: this.rates.tood3Top,
            direct2TopRate: this.rates.direct2Top,
            direct2UnderRate: this.rates.direct2Under,
            run3TopRate: this.rates.run3Top,
            run2UnderRate: this.rates.run2Under,

            yeekee1st16thActive: this.yeekee1st16thActive,
            at1stRate: this.at1stRate,
            at16thRate: this.at16thRate
          }
        };

        try {
          await updateLottoById(this.$route.params.id, req);
          this.$Swal.fire(
            this.$t("info"),
            this.$t("edit_product_success"),
            "success"
          );
          this.$router.back();
        } catch (error) {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("edit_product_error"),
            "error"
          );
        }
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
