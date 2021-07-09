<template>
  <v-card v-if="product" class="my-0" style="height: 50%">
    <v-card-title class="subheading font-weight-bold">
      <v-icon left color="success"> mdi-plus-circle </v-icon>
      {{ $t("risk_setting") }}
    </v-card-title>
    <v-divider></v-divider>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="6">
        <validation-observer ref="observer">
          <v-container class="py-0">
            <v-expansion-panels v-model="panel" multiple>
              <v-expansion-panel>
                <v-expansion-panel-header>{{
                  $t("general_setting")
                }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-text-field
                    v-model="product[getLangNameKeyFromLocale(locale)]"
                    :label="$t('product2')"
                    readonly
                  >
                    <v-icon slot="prepend">mdi-gamepad-variant</v-icon>
                  </v-text-field>

                  <v-row justify="space-around">
                    <v-col cols="12" md="12">
                      <v-dialog
                        ref="resultedTimeDialog"
                        v-model="resultedTimeModal"
                        :return-value.sync="resultedTime"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="resultedTime"
                            :label="$t('announced_time')"
                            prepend-icon="access_time"
                            readonly
                            v-bind="attrs"
                            :error-messages="resultedTimeErrors"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="resultedTimeModal"
                          v-model="resultedTime"
                          format="24hr"
                          full-width
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="resultedTimeModal = false"
                            >{{ $t("cancel") }}</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.resultedTimeDialog.save(resultedTime)"
                            >{{ $t("ok") }}</v-btn
                          >
                        </v-time-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>

                  <v-row justify="space-around">
                    <v-col cols="12" md="12">
                      <v-dialog
                        ref="endedTimeDialog"
                        v-model="endedTimeModal"
                        :return-value.sync="endedTime"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="endedTime"
                            :label="$t('end_time')"
                            prepend-icon="access_time"
                            readonly
                            v-bind="attrs"
                            :error-messages="endedTimeErrors"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="endedTimeModal"
                          v-model="endedTime"
                          format="24hr"
                          full-width
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="endedTimeModal = false"
                            >{{ $t("cancel") }}</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.endedTimeDialog.save(endedTime)"
                            >{{ $t("ok") }}</v-btn
                          >
                        </v-time-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>

                  <v-row justify="space-around">
                    <v-col cols="12" md="12">
                      <v-dialog
                        ref="startedTimeDialog"
                        v-model="startedTimeModal"
                        :return-value.sync="startedTime"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="startedTime"
                            :label="$t('start_time')"
                            prepend-icon="access_time"
                            readonly
                            v-bind="attrs"
                            :error-messages="startedTimeErrors"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="startedTimeModal"
                          v-model="startedTime"
                          format="24hr"
                          full-width
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="startedTimeModal = false"
                            >{{ $t("cancel") }}</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.startedTimeDialog.save(startedTime)"
                            >{{ $t("ok") }}</v-btn
                          >
                        </v-time-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-menu
                        ref="menu"
                        v-model="selectDatesModal"
                        :close-on-content-click="false"
                        :return-value.sync="selectDates"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-combobox
                            v-model="selectDates"
                            multiple
                            chips
                            small-chips
                            :label="$t('select_add_date')"
                            prepend-icon="event"
                            readonly
                            v-bind="attrs"
                            :error-messages="selectDatesErrors"
                            v-on="on"
                          ></v-combobox>
                        </template>
                        <v-date-picker
                          v-model="selectDates"
                          multiple
                          no-title
                          scrollable
                          :events="onDatePickerChange"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            color="gray"
                            text
                            @click="selectDatesModal = false"
                            >{{ $t("cancel") }}</v-btn
                          >
                          <v-btn
                            color="orange"
                            text
                            @click="selectDates = null"
                            >{{ $t("clear") }}</v-btn
                          >
                          <v-btn
                            color="orange"
                            text
                            @click="onEverydayClicked"
                            >{{ $t("every_day") }}</v-btn
                          >
                          <v-btn
                            text
                            color="green"
                            @click="onSelectDatesSubmit"
                            >{{ $t("ok") }}</v-btn
                          >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('open_play_before_end_date')"
                        rules="required|numeric|min_value:0"
                      >
                        <v-text-field
                          v-model.number="openPlayBeforeResultedAtInDays"
                          type="number"
                          :label="$t('open_play_before_end_date')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">access_time</v-icon>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('open_play_before_end_date')"
                        rules="required|numeric|min_value:0"
                      >
                        <v-text-field
                          v-model.number="openPlayBeforeResultedAtInDays"
                          type="number"
                          :label="$t('open_play_before_end_date')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">access_time</v-icon>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>

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
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>{{
                  $t("lotto_type_and_payment_rate")
                }}</v-expansion-panel-header>
                <v-expansion-panel-content>
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
                          v-model="status[getKey(key)]"
                          class="mt-0"
                          :label="`${$t('status')} ${
                            status[getKey(key)] ? $t('open') : $t('close')
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
                          v-model.number="rates[getKey(key)]"
                          type="number"
                          class="pt-0 mt-0"
                          :label="$t('rate')"
                          :disabled="!status[getKey(key)]"
                          :error-messages="errors"
                          @input="onRateInput(getKey(key), rates[getKey(key)])"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>{{
                  $t("risk_setting")
                }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <br />
                  <br />
                  <div
                    v-for="(key, index) in Object.keys(lottoRateTypes)"
                    :key="index"
                  >
                    <strong>{{ $t(key.toLowerCase()) }}</strong>
                    <br />
                    <br />
                    <v-row justify="start" class="pl-3">
                      <v-col cols="12" sm="3" align-self="start" class="pa-0">
                        <v-text-field
                          v-model.number="inputDiffs[getKey(key)]"
                          class="pt-0"
                          :label="$t('rate_range')"
                          name="diff"
                          type="number"
                          placeholder="บาท"
                          hide-details
                          :disabled="!status[getKey(key)]"
                          @input="
                            onDiffInput(getKey(key), inputDiffs[getKey(key)])
                          "
                        />
                      </v-col>
                    </v-row>
                    <br />
                    <v-simple-table :dense="true">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-center">{{ $t("pay") }}</th>
                            <th class="text-center">{{ $t("limit") }}</th>
                            <th class="text-center">{{ $t("risk") }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="i in 6" :key="i">
                            <td class="text-right font-weight-bold">
                              {{ getRate(getKey(key), i, rates[getKey(key)]) }}
                            </td>
                            <td class="text-right">
                              <v-row justify="end" class="pa-0">
                                <v-col
                                  cols="12"
                                  sm="6"
                                  align-self="end"
                                  class="pa-0"
                                >
                                  <v-text-field
                                    v-model.number="inputRisks[getKey(key)][i]"
                                    class="pt-0 risk-input"
                                    name="limit"
                                    type="number"
                                    :placeholder="$t('limit')"
                                    hide-details
                                    :disabled="!status[getKey(key)]"
                                    @input="
                                      onLimitInput(
                                        getKey(key),
                                        i,
                                        inputRisks[getKey(key)][i]
                                      )
                                    "
                                  />
                                </v-col>
                              </v-row>
                            </td>
                            <td class="text-right">
                              {{ getRisk(getKey(key), i, rates[getKey(key)]) }}
                            </td>
                          </tr>
                          <tr>
                            <td class="text-right font-weight-bold">
                              {{ getRate(getKey(key), 7, rates[getKey(key)]) }}
                            </td>
                            <td class="text-right">Unlimited</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td colspan="2" class="text-right font-weight-bold">
                              {{ $t("total_risk") }}
                            </td>
                            <td class="text-right">
                              {{ getSumRisk(getKey(key)) }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                    <br />
                    <br />
                  </div>

                  <v-row>
                    <strong>{{ $t("total_risk") }} {{ getSumRisks() }}</strong>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-divider class="mt-2" />

            <v-row>
              <v-col class="pb-0">
                <v-btn
                  type="button"
                  color="grey"
                  block
                  @click="onResetProductClicked"
                  ><v-icon left>refresh</v-icon
                  ><strong>{{ $t("reset_factory") }}</strong></v-btn
                >
              </v-col>
              <v-col class="pb-0">
                <v-btn
                  type="button"
                  color="warning"
                  :loading="processing"
                  block
                  @click="onCloneProductClicked"
                  ><v-icon left>get_app</v-icon
                  ><strong>{{ $t("reset_to_default") }}</strong></v-btn
                >
              </v-col>
              <v-col class="pb-0">
                <v-btn
                  type="submit"
                  color="success"
                  :loading="processing"
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

      <LottoLimitNumberDialog
        ref="lottoLimitNumberDialog"
        @after-saved="onLottoLimitNumberAfterSaved"
      />
    </v-row>
  </v-card>
</template>

<script>
import { get } from "vuex-pathify";
import { lottoTypes, getLottoTypeByKey } from "@/utils/LottoTypeFormatter.js";
import { getProductById } from "@/api/productLotto.js";
import { createLotto } from "@/api/lotto.js";
import LottoLimitNumberDialog from "./LottoLimitNumberDialog";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  components: {
    LottoLimitNumberDialog
  },
  data: () => ({
    getLangNameKeyFromLocale,
    lottoTypes,
    lottoRateTypes: [],
    product: null,
    lotto: {},
    name: null,
    type: null,
    status: {
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
    rates: {
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
    inputRisks: {
      direct3Top: {},
      direct3Under: {},
      tood3Top: {},
      direct2Top: {},
      direct2Under: {},
      run3Top: {},
      run2Under: {},
      direct3Front: {},
      directResult: {},
      toodResult: {}
    },
    inputDiffs: {
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
    risks: {
      direct3Top: {
        sum: 0
      },
      direct3Under: {
        sum: 0
      },
      tood3Top: {
        sum: 0
      },
      direct2Top: {
        sum: 0
      },
      direct2Under: {
        sum: 0
      },
      run3Top: {
        sum: 0
      },
      run2Under: {
        sum: 0
      },
      direct3Front: {
        sum: 0
      },
      directResult: {
        sum: 0
      },
      toodResult: {
        sum: 0
      }
    },
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
    },
    selectDatesModal: false,
    selectDates: null,
    selectDatesErrors: null,
    startedTimeModal: false,
    startedTime: null,
    startedTimeErrors: null,
    endedTimeModal: false,
    endedTime: null,
    endedTimeErrors: null,
    resultedTimeModal: false,
    resultedTime: null,
    resultedTimeErrors: null,
    remainingTime: "processing",
    openPlayBeforeResultedAtInDays: 0,

    minimumByRound: null,
    maximumByRound: null,

    panel: [0, 1, 2],
    lottoLimitNumbers: [],
    processing: false
  }),
  computed: {
    locale: get("global/locale")
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
      delete this.lottoRateTypes.TOOD2TOP;
      delete this.lottoRateTypes.RUN2TOP;

      this.startedTime = "00:00";
      this.endedTime = "00:00";
      this.resultedTime = "00:00";

      this.product = await getProductById(this.$route.params.id);
      this.initialData(this.product);
    },
    initialData(product, forceReset) {
      this.datePickerTemp = [];
      this.status = {
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
      };
      this.rates = {
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
      };
      this.inputRisks = {
        direct3Top: {},
        direct3Under: {},
        tood3Top: {},
        direct2Top: {},
        direct2Under: {},
        run3Top: {},
        run2Under: {},
        direct3Front: {},
        directResult: {},
        toodResult: {}
      };
      this.inputDiffs = {
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
      };
      this.minimumByItems = {
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
      };
      this.maximumByItems = {
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
      };
      this.maximumByNumbers = {
        direct3Top: null,
        direct3Under: null,
        tood3Top: null,
        direct2Top: null,
        direct2Under: null,
        run3Top: null,
        run2Under: null,
        direct3Front: null,
        directResult: null
      };
      this.risks = {
        direct3Top: {
          sum: 0
        },
        direct3Under: {
          sum: 0
        },
        tood3Top: {
          sum: 0
        },
        direct2Top: {
          sum: 0
        },
        direct2Under: {
          sum: 0
        },
        run3Top: {
          sum: 0
        },
        run2Under: {
          sum: 0
        },
        direct3Front: {
          sum: 0
        },
        directResult: {
          sum: 0
        }
      };
      this.startedTime = "00:00";
      this.endedTime = "00:00";
      this.resultedTime = "00:00";

      this.minimumByRound = null;
      this.maximumByRound = null;

      if (!forceReset) {
        if (product.startedTime) {
          this.startedTime = product.startedTime;
        }
        if (product.endedTime) {
          this.endedTime = product.endedTime;
        }
        if (product.resultedTime) {
          this.resultedTime = product.resultedTime;
        }
        if (product.openPlayBeforeResultedAtInDays) {
          this.openPlayBeforeResultedAtInDays =
            product.openPlayBeforeResultedAtInDays;
        }

        this.minimumByRound = product.minimumByRound;
        this.maximumByRound = product.maximumByRound;

        this.status.direct3Top = product.direct3TopActive;
        this.status.direct3Under = product.direct3UnderActive;
        this.status.tood3Top = product.tood3TopActive;
        this.status.direct2Top = product.direct2TopActive;
        this.status.direct2Under = product.direct2UnderActive;
        this.status.run3Top = product.run3TopActive;
        this.status.run2Under = product.run2UnderActive;
        this.status.direct3Front = product.direct3FrontActive;
        this.status.directResult = product.directResultActive;
        this.status.toodResult = product.toodResultActive;

        this.rates.direct3Top = product.direct3TopRate;
        this.rates.direct3Under = product.direct3UnderRate;
        this.rates.direct3Under = product.direct3UnderRate;
        this.rates.tood3Top = product.tood3TopRate;
        this.rates.direct2Top = product.direct2TopRate;
        this.rates.direct2Under = product.direct2UnderRate;
        this.rates.run3Top = product.run3TopRate;
        this.rates.run2Under = product.run2UnderRate;
        this.rates.direct3Front = product.direct3FrontRate;
        this.rates.directResult = product.directResultRate;
        this.rates.toodResult = product.toodResultRates;

        if (product.minimumByItems) {
          this.minimumByItems.direct3Top = product.minimumByItems.direct3Top;
          this.minimumByItems.direct3Under =
            product.minimumByItems.direct3Under;
          this.minimumByItems.tood3Top = product.minimumByItems.tood3Top;
          this.minimumByItems.direct2Top = product.minimumByItems.direct2Top;
          this.minimumByItems.direct2Under =
            product.minimumByItems.direct2Under;
          this.minimumByItems.run3Top = product.minimumByItems.run3Top;
          this.minimumByItems.run2Under = product.minimumByItems.run2Under;
          this.minimumByItems.direct3Front =
            product.minimumByItems.direct3Front;
          this.minimumByItems.directResult =
            product.minimumByItems.directResult;
          this.minimumByItems.toodResult = product.minimumByItems.toodResult;
        }
        if (product.maximumByItems) {
          this.maximumByItems.direct3Top = product.maximumByItems.direct3Top;
          this.maximumByItems.direct3Under =
            product.maximumByItems.direct3Under;
          this.maximumByItems.tood3Top = product.maximumByItems.tood3Top;
          this.maximumByItems.direct2Top = product.maximumByItems.direct2Top;
          this.maximumByItems.direct2Under =
            product.maximumByItems.direct2Under;
          this.maximumByItems.run3Top = product.maximumByItems.run3Top;
          this.maximumByItems.run2Under = product.maximumByItems.run2Under;
          this.maximumByItems.direct3Front =
            product.maximumByItems.direct3Front;
          this.maximumByItems.directResult =
            product.maximumByItems.directResult;
          this.maximumByItems.toodResult = product.maximumByItems.toodResult;
        }
        if (product.maximumByNumbers) {
          this.maximumByNumbers.direct3Top =
            product.maximumByNumbers.direct3Top;
          this.maximumByNumbers.direct3Under =
            product.maximumByNumbers.direct3Under;
          this.maximumByNumbers.tood3Top = product.maximumByNumbers.tood3Top;
          this.maximumByNumbers.direct2Top =
            product.maximumByNumbers.direct2Top;
          this.maximumByNumbers.direct2Under =
            product.maximumByNumbers.direct2Under;
          this.maximumByNumbers.run3Top = product.maximumByNumbers.run3Top;
          this.maximumByNumbers.run2Under = product.maximumByNumbers.run2Under;
          this.maximumByNumbers.direct3Front =
            product.maximumByNumbers.direct3Front;
          this.maximumByNumbers.directResult =
            product.maximumByNumbers.directResult;
          this.maximumByNumbers.toodResult =
            product.maximumByNumbers.toodResult;
        }

        if (product.risks && product.risks.length > 0) {
          this.$_.forEach(product.risks, o => {
            this.inputDiffs[this.getKey(o.type)] =
              o.steps[0].rate - o.steps[1].rate;
            this.inputRisks[this.getKey(o.type)] = {
              1: o.steps[0].limit,
              2: o.steps[1].limit,
              3: o.steps[2].limit,
              4: o.steps[3].limit,
              5: o.steps[4].limit,
              6: o.steps[5].limit
            };
            this.risks[this.getKey(o.type)] = {
              1: o.steps[0],
              2: o.steps[1],
              3: o.steps[2],
              4: o.steps[3],
              5: o.steps[4],
              6: o.steps[5],
              7: o.steps[6]
            };
            this.risks[this.getKey(o.type)].sum = o.totalRisk;
          });
        }
      }
    },
    getKey(key) {
      if (key === "DIRECTRESULT") {
        return "directResult";
      }
      return this.$_.camelCase(key);
    },
    getRate(key, index, rate) {
      let result = 0;
      if (rate) {
        const diff = this.inputDiffs[key];
        if (diff) {
          result = rate - diff * (index - 1);
        }
      }
      if (!this.risks[key][index]) {
        this.risks[key][index] = {};
      }
      this.risks[key][index].rate = result;
      return this.$Numeral(result).format("0,0.00");
    },
    getRisk(key, index) {
      return this.$Numeral(this.risks[key][index].risk).format("0,0.00");
    },
    getSumRisk(key) {
      this.getSumRisks();
      return this.$Numeral(this.risks[key].sum).format("0,0.00");
    },
    getSumRisks() {
      let result = 0;
      this.$_.forOwn(this.risks, o1 => {
        this.$_.forOwn(o1, o2 => {
          if (o2.risk) {
            result += o2.risk;
          }
        });
      });
      return this.$Numeral(result).format("0,0.00");
    },
    onDiffInput(key, value) {
      this.$nextTick(() => {
        let sum = 0;
        this.$_.forOwn(this.risks[key], (value, index) => {
          if (value.limit) {
            const risk = this.risks[key][index].rate * value.limit;
            this.risks[key][index].risk = risk;
            sum += risk;
          }
        });
        this.risks[key].sum = sum;
      });
    },
    onLimitInput(key, index, limit) {
      let risk = 0;
      const rate = this.risks[key][index].rate;
      if (rate) {
        risk = rate * limit;
      }
      if (!this.risks[key][index]) {
        this.risks[key][index] = {};
      }
      this.risks[key][index].limit = limit;
      this.risks[key][index].risk = risk;

      let sum = 0;
      this.$_.forOwn(this.risks[key], (value, key) => {
        if (value.risk) {
          sum += value.risk;
        }
      });
      this.risks[key].sum = sum;
    },
    onRateInput(key, rate) {
      this.$nextTick(() => {
        let sum = 0;
        this.$_.forOwn(this.risks[key], (value, index) => {
          if (value.limit) {
            const risk = value.rate * value.limit;
            this.risks[key][index].risk = risk;
            sum += risk;
          }
        });
        this.risks[key].sum = sum;
      });
    },
    onCloneProductClicked() {
      this.processing = true;
      getProductById(this.$route.params.id).then(product => {
        this.initialData(product);
        this.processing = false;
      });
    },
    async onResetProductClicked() {
      this.initialData(this.product, true);
    },
    validateSelectDatesInput() {
      if (!this.selectDates || this.selectDates.length === 0) {
        this.selectDatesErrors = "กรุณาเลือกวันที่ต้องการเพิ่ม";
        return false;
      }
      this.selectDatesErrors = null;
      return true;
    },
    onDatePickerChange(date) {
      if (this.datePickerTemp.length > 0) {
        let firstDate = this.datePickerTemp[0];
        firstDate = this.$Moment(firstDate, "YYYY-MM-DD").startOf("month");
        const currentDate = this.$Moment(date, "YYYY-MM-DD");
        if (currentDate.diff(firstDate, "months") !== 0) {
          this.datePickerTemp = [];
        } else {
          const endOfMonth = this.$Moment(firstDate, "YYYY-MM-DD").endOf(
            "month"
          );
          if (
            endOfMonth.diff(firstDate, "days") + 1 ===
            this.datePickerTemp.length
          ) {
            return;
          }
        }
      }
      this.datePickerTemp.push(date);
    },
    onEverydayClicked() {
      if (this.selectDates === null) {
        this.selectDates = [];
      }
      this.selectDates = this.selectDates.concat(this.datePickerTemp);
    },
    onSelectDatesSubmit() {
      this.validateSelectDatesInput();
      this.$refs.menu.save(this.selectDates);
    },
    async onSubmitClicked() {
      let validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }
      if (!this.validateSelectDatesInput()) {
        return false;
      }

      await this.addLotto();
    },
    async addLotto() {
      this.processing = true;
      const risks = [];
      this.$_.forOwn(this.risks, (value, key) => {
        risks.push({
          productLottoId: this.$route.params.id,
          type: key.toUpperCase(),
          steps: [
            value[1],
            value[2],
            value[3],
            value[4],
            value[5],
            value[6],
            value[7]
          ],
          totalRisk: value.sum
        });
      });
      const req = {
        type: this.product.type,
        startedTime: this.startedTime,
        endedTime: this.endedTime,
        resultedTime: this.resultedTime,
        selectDates: this.selectDates,
        openPlayBeforeResultedAtInDays: this.openPlayBeforeResultedAtInDays,
        productLottoId: this.$route.params.id,
        status: "ENABLE",
        minimumByRound: this.minimumByRound,
        maximumByRound: this.maximumByRound,
        minimumByItems: this.minimumByItems,
        maximumByItems: this.maximumByItems,
        maximumByNumbers: this.maximumByNumbers,
        productConfig: {
          ...this.product,
          id: this.product._id.toString(),
          direct3TopActive: this.status.direct3Top,
          direct3UnderActive: this.status.direct3Under,
          tood3TopActive: this.status.tood3Top,
          direct2TopActive: this.status.direct2Top,
          direct2UnderActive: this.status.direct2Under,
          run3TopActive: this.status.run3Top,
          run2UnderActive: this.status.run2Under,
          direct3FrontActive: this.status.direct3Front,
          directResultActive: this.status.directResult,
          toodResultActive: this.status.toodResult,

          direct3TopRate: this.rates.direct3Top,
          direct3UnderRate: this.rates.direct3Under,
          tood3TopRate: this.rates.tood3Top,
          direct2TopRate: this.rates.direct2Top,
          direct2UnderRate: this.rates.direct2Under,
          run3TopRate: this.rates.run3Top,
          run2UnderRate: this.rates.run2Under,
          direct3FrontRate: this.rates.direct3Front,
          directResultRate: this.rates.directResult,
          toodResultRate: this.rates.toodResult,

          risks: risks
        }
      };

      try {
        await createLotto(req);
        this.processing = false;
        this.$Swal.fire(
          this.$t("info"),
          this.$t("add_product_success"),
          "success"
        );
        this.$router.back();
      } catch (error) {
        this.processing = false;
        this.$Swal.fire(
          this.$t("error3"),
          this.$t("add_product_error"),
          "error"
        );
      }
    }
  }
};
</script>

<style>
.risk-input input {
  text-align: right;
}

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
