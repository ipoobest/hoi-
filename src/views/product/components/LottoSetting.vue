<template>
  <v-card v-if="product" class="my-0" style="height: 50%">
    <v-card-title class="subheading font-weight-bold">
      <v-icon left color="success"> mdi-plus-circle </v-icon>
      {{ $t("risk_setting") }}
    </v-card-title>
    <v-divider></v-divider>
    <v-row v-if="!main && !add" class="d-flex justify-end text-right">
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
                  <template v-if="main && !add">
                    <v-tooltip v-model="show" top>
                      <template v-slot:activator="{ on, attrs }">
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('product_code')"
                          rules="required|min:2|max:5"
                        >
                          <v-text-field
                            v-model="code"
                            :label="$t('product_code')"
                            :error-messages="errors"
                            @input="onInputCode"
                          >
                            <v-icon slot="append" v-bind="attrs" v-on="on"
                              >mdi-help</v-icon
                            >
                            <v-icon slot="prepend">mdi-numeric</v-icon>
                          </v-text-field>
                        </validation-provider>
                      </template>
                      <span>{{ $t("product_code_tooltips") }}</span>
                    </v-tooltip>
                    <v-tooltip v-model="show" top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="icon"
                          :label="$t('symbol')"
                          @input="onInputIcon"
                        >
                          <v-icon slot="append" v-bind="attrs" v-on="on"
                            >mdi-help</v-icon
                          >
                          <v-icon slot="prepend">flag</v-icon>
                        </v-text-field>
                      </template>
                      <span>
                        <p>
                          {{ $t("symbol_tooltips_1") }}
                        </p>
                        <p>
                          {{ $t("symbol_tooltips_2") }}
                          <v-icon slot="prepend" color="white"
                            >account_balance</v-icon
                          >
                        </p>
                      </span>
                    </v-tooltip>
                  </template>

                  <template v-if="!main">
                    <validation-provider
                      v-slot="{ errors }"
                      :name="$t('lotto_en')"
                      rules="required_if"
                    >
                      <v-text-field
                        v-model="name"
                        :label="$t('lotto_en')"
                        :error-messages="errors"
                      >
                        <v-icon slot="prepend">mdi-gamepad-variant</v-icon>
                      </v-text-field>
                    </validation-provider>
                    <validation-provider
                      v-slot="{ errors }"
                      :name="$t('lotto_th')"
                      rules="required"
                    >
                      <v-text-field
                        v-model="thaiName"
                        :label="$t('lotto_th')"
                        :error-messages="errors"
                      >
                        <v-icon slot="prepend">mdi-gamepad-variant</v-icon>
                      </v-text-field>
                    </validation-provider>
                    <v-row justify="space-around">
                      <v-col cols="12" md="6">
                        <v-dialog
                          ref="resultedAtDialog"
                          v-model="resultedAtModal"
                          :return-value.sync="resultedAt"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="resultedAt"
                              :label="$t('announced_date')"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              :error-messages="resultedAtErrors"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="resultedAt"
                            scrollable
                            :locale="locale"
                            :min="$Moment(endedAt).format('YYYY-MM-DD')"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="resultedAtModal = false"
                              >{{ $t("cancel") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="onResultedAtChange"
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                      <v-col cols="12" md="6">
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
                              :label="$t('time')"
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
                              @click="
                                $refs.resultedTimeDialog.save(resultedTime)
                              "
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-time-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>

                    <v-row justify="space-around">
                      <v-col cols="12" md="6">
                        <v-dialog
                          ref="endedAtDialog"
                          v-model="endedAtModal"
                          :return-value.sync="endedAt"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="endedAt"
                              :label="$t('end_date')"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              :error-messages="endedAtErrors"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="endedAt"
                            scrollable
                            :locale="locale"
                            :min="$Moment(startedAt).format('YYYY-MM-DD')"
                            :max="$Moment(resultedAt).format('YYYY-MM-DD')"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="endedAtModal = false"
                              >{{ $t("cancel") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="onEndedAtChange"
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                      <v-col cols="12" md="6">
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
                              :label="$t('time')"
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
                      <v-col cols="12" md="6">
                        <v-dialog
                          ref="startedAtDialog"
                          v-model="startedAtModal"
                          :return-value.sync="startedAt"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="startedAt"
                              :label="$t('start_date')"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              :error-messages="startedAtErrors"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="startedAt"
                            scrollable
                            :locale="locale"
                            :max="$Moment(endedAt).format('YYYY-MM-DD')"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="startedAtModal = false"
                              >{{ $t("cancel") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="onStartedAtChange"
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                      <v-col cols="12" md="6">
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
                              :label="$t('time')"
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
                  </template>
                  <template v-else>
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
                              @click="
                                $refs.resultedTimeDialog.save(resultedTime)
                              "
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
                        <v-text-field
                          v-model.number="openPlayBeforeResultedAtInDays"
                          type="number"
                          :label="$t('open_play_before_end_date')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">access_time</v-icon>
                        </v-text-field>
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
                  </template>
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

              <v-expansion-panel v-if="!main && !add">
                <v-expansion-panel-header>{{
                  $t("limit_number_setting")
                }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row justify="end">
                    <v-col cols="12" md="3">
                      <v-btn
                        type="button"
                        color="green"
                        :disabled="lotto.finished"
                        @click="onAddNumberLimitClicked"
                        ><v-icon left>add</v-icon
                        ><strong>{{ $t("add") }}</strong></v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-right">{{ $t("number") }}</th>
                          <th class="text-left">{{ $t("type") }}</th>
                          <th class="text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in lottoLimitNumbers" :key="item.name">
                          <td class="text-right">{{ item.number }}</td>
                          <td class="text-left">
                            {{ getLottoTypeByKey(item.type) }}
                          </td>
                          <td class="text-right">
                            <v-btn
                              icon
                              color="red"
                              @click="onDeleteLottoLimitNumberClicked(item._id)"
                            >
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-divider class="mt-2" />

            <v-row>
              <v-col v-if="!main || add" class="pb-0">
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
              <v-col v-if="!main || add" class="pb-0">
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
import { getProductById, updateProductLottoById } from "@/api/productLotto.js";
import { createOrUpdateRisks } from "@/api/productLottoRisks.js";
import {
  getLottoById,
  updateLottoById,
  updateLottoByProductId,
  createLotto
} from "@/api/lotto.js";
import {
  getLottoLimitNumbers,
  deleteLottoLimitNumber
} from "@/api/lottoLimitNumber.js";
import { getSystemTime } from "@/api/system.js";
import LottoLimitNumberDialog from "./LottoLimitNumberDialog";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  components: {
    LottoLimitNumberDialog
  },
  props: {
    add: {
      type: Boolean,
      default: false
    },
    main: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    getLangNameKeyFromLocale,
    lottoTypes,
    lottoRateTypes: [],
    product: null,
    lotto: {},
    name: null,
    thaiName: null,
    type: null,
    code: null,
    icon: null,
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
      directDigits: null,
      directResult: null,
      toodResult: null
    },
    startedAtModal: false,
    startedAt: null,
    startedAtErrors: null,
    startedTimeModal: false,
    startedTime: null,
    startedTimeErrors: null,
    endedAtModal: false,
    endedAt: null,
    endedAtErrors: null,
    endedTimeModal: false,
    endedTime: null,
    endedTimeErrors: null,
    resultedAtModal: false,
    resultedAt: null,
    resultedAtErrors: null,
    resultedTimeModal: false,
    resultedTime: null,
    resultedTimeErrors: null,
    openPlayBeforeResultedAtInDays: 0,
    remainingTime: "processing",

    minimumByRound: null,
    maximumByRound: null,

    panel: [0, 1, 2, 3],
    lottoLimitNumbers: []
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

      this.startedAt = this.$Moment().format("YYYY-MM-DD");
      this.startedTime = "00:00";
      this.endedAt = this.$Moment().format("YYYY-MM-DD");
      this.endedTime = "00:00";
      this.resultedAt = this.$Moment().format("YYYY-MM-DD");
      this.resultedTime = "00:00";

      await this.fetchLottoLimitNumber();

      if (this.main || this.add) {
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
      this.initialData(this.product, this.lotto);
    },
    onInputCode(value) {
      if (value) {
        this.code = value.toUpperCase();
      } else {
        this.code = value;
      }
    },
    onInputIcon(value) {
      if (value) {
        this.icon = value.toLowerCase();
      } else {
        this.icon = value;
      }
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
        const remainingTimeMoment = this.$Moment.utc(remainingTime);
        let days = Number(remainingTimeMoment.format("D"));
        days--;
        this.remainingTime =
          `${days} ${this.$t("remeaning_day")} ` +
          remainingTimeMoment.format(this.$t("remeaning_time"));
        if (remainingTime <= 0) {
          clearInterval(this.worker);
          this.worker = null;
          this.lotto.finished = true;
          this.remainingTime = "times_up";
        }
      }, 1000);
    },
    initialData(product, lotto, forceReset) {
      this.name = null;
      this.thaiName = null;
      this.type = null;
      this.code = null;
      this.icon = null;

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
        directResult: null,
        toodResult: null
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
        },
        toodResult: {
          sum: 0
        }
      };
      this.startedAt = this.$Moment().format("YYYY-MM-DD");
      this.startedTime = "00:00";
      this.endedAt = this.$Moment().format("YYYY-MM-DD");
      this.endedTime = "00:00";
      this.resultedAt = this.$Moment().format("YYYY-MM-DD");
      this.resultedTime = "00:00";
      this.openPlayBeforeResultedAtInDays = 0;

      this.minimumByRound = null;
      this.maximumByRound = null;

      if (!forceReset) {
        if (!this.add) {
          this.name = product.thaiName;
          this.code = product.code.substring(2);
          if (product.iconType === "flag") {
            this.icon = product.iconName;
          }
        }
        this.type = product.type;
        if (!this.main) {
          this.name = lotto.name;
          this.thaiName = lotto.thaiName;
          this.startedAt = this.$Moment(lotto.startedAt).format("YYYY-MM-DD");
          this.startedTime = this.$Moment(lotto.startedAt).format("HH:mm");
          this.endedAt = this.$Moment(lotto.endedAt).format("YYYY-MM-DD");
          this.endedTime = this.$Moment(lotto.endedAt).format("HH:mm");
          this.resultedAt = this.$Moment(lotto.resultedAt).format("YYYY-MM-DD");
          this.resultedTime = this.$Moment(lotto.resultedAt).format("HH:mm");

          this.minimumByRound = lotto.minimumByRound;
          this.maximumByRound = lotto.maximumByRound;

          if (lotto.minimumByItems) {
            this.minimumByItems.direct3Top = lotto.minimumByItems.direct3Top;
            this.minimumByItems.direct3Under =
              lotto.minimumByItems.direct3Under;
            this.minimumByItems.tood3Top = lotto.minimumByItems.tood3Top;
            this.minimumByItems.direct2Top = lotto.minimumByItems.direct2Top;
            this.minimumByItems.direct2Under =
              lotto.minimumByItems.direct2Under;
            this.minimumByItems.run3Top = lotto.minimumByItems.run3Top;
            this.minimumByItems.run2Under = lotto.minimumByItems.run2Under;
            this.minimumByItems.direct3Front =
              lotto.minimumByItems.direct3Front;
            this.minimumByItems.directResult =
              lotto.minimumByItems.directResult;
            this.minimumByItems.toodResult = lotto.minimumByItems.toodResult;
          }
          if (lotto.maximumByItems) {
            this.maximumByItems.direct3Top = lotto.maximumByItems.direct3Top;
            this.maximumByItems.direct3Under =
              lotto.maximumByItems.direct3Under;
            this.maximumByItems.tood3Top = lotto.maximumByItems.tood3Top;
            this.maximumByItems.direct2Top = lotto.maximumByItems.direct2Top;
            this.maximumByItems.direct2Under =
              lotto.maximumByItems.direct2Under;
            this.maximumByItems.run3Top = lotto.maximumByItems.run3Top;
            this.maximumByItems.run2Under = lotto.maximumByItems.run2Under;
            this.maximumByItems.direct3Front =
              lotto.maximumByItems.direct3Front;
            this.maximumByItems.directResult =
              lotto.maximumByItems.directResult;
            this.maximumByItems.toodResult = lotto.maximumByItems.toodResult;
          }
          if (lotto.maximumByNumbers) {
            this.maximumByNumbers.direct3Top =
              lotto.maximumByNumbers.direct3Top;
            this.maximumByNumbers.direct3Under =
              lotto.maximumByNumbers.direct3Under;
            this.maximumByNumbers.tood3Top = lotto.maximumByNumbers.tood3Top;
            this.maximumByNumbers.direct2Top =
              lotto.maximumByNumbers.direct2Top;
            this.maximumByNumbers.direct2Under =
              lotto.maximumByNumbers.direct2Under;
            this.maximumByNumbers.run3Top = lotto.maximumByNumbers.run3Top;
            this.maximumByNumbers.run2Under = lotto.maximumByNumbers.run2Under;
            this.maximumByNumbers.direct3Front =
              lotto.maximumByNumbers.direct3Front;
            this.maximumByNumbers.directResult =
              lotto.maximumByNumbers.directResult;
            this.maximumByNumbers.toodResult =
              lotto.maximumByNumbers.toodResult;
          }
        } else {
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
            this.maximumByNumbers.run2Under =
              product.maximumByNumbers.run2Under;
            this.maximumByNumbers.direct3Front =
              product.maximumByNumbers.direct3Front;
            this.maximumByNumbers.directResult =
              product.maximumByNumbers.directResult;
            this.maximumByNumbers.toodResult =
              product.maximumByNumbers.toodResult;
          }
        }

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
        this.rates.toodResult = product.toodResultRate;

        if (product.risks && product.risks.length > 0) {
          this.$_.forEach(product.risks, o => {
            let input = 0;
            let limit1 = (o.steps[0] && o.steps[0].limit) || 0;
            let limit2 = (o.steps[1] && o.steps[1].limit) || 0;
            let limit3 = (o.steps[2] && o.steps[2].limit) || 0;
            let limit4 = (o.steps[3] && o.steps[3].limit) || 0;
            let limit5 = (o.steps[4] && o.steps[4].limit) || 0;
            let limit6 = (o.steps[5] && o.steps[5].limit) || 0;
            if (o.steps[0] && o.steps[1]) {
              input = o.steps[0].rate - o.steps[1].rate;
            }
            this.inputDiffs[this.getKey(o.type)] = input;
            this.inputRisks[this.getKey(o.type)] = {
              1: limit1,
              2: limit2,
              3: limit3,
              4: limit4,
              5: limit5,
              6: limit6
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
          if (o2 && o2.risk) {
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
    async onCloneProductClicked() {
      let product;
      if (this.add) {
        product = await getProductById(this.$route.params.id);
      } else {
        product = await getProductById(this.lotto.productConfig._id.toString());
      }
      this.initialData(product, this.lotto);
    },
    async onResetProductClicked() {
      if (this.add) {
        this.initialData(this.product, this.lotto, true);
      } else {
        this.initialData(this.product, this.lotto);
      }
    },
    validateStartedAt() {
      this.startedAtErrors = null;
      if (!this.startedAt) {
        this.startedAtErrors = "กรุณาเลือก เริ่มเมื่อ";
        return false;
      }
      const result = this.$Moment(
        this.startedAt + this.startedTime,
        "YYYY-MM-DDHH:mm"
      ).isBefore(
        this.$Moment(this.endedAt + this.endedTime, "YYYY-MM-DDHH:mm").add(
          1,
          "days"
        )
      );
      if (!result) {
        this.startedAtErrors = "เริ่มเมื่อ ไม่ถูกต้อง";
      }
      return result;
    },
    validateEndedAt() {
      this.endedAtErrors = null;
      if (!this.endedAt) {
        this.endedAtErrors = "กรุณาเลือก สิ้นสุดเมื่อ";
        return false;
      }
      const result =
        this.$Moment(this.endedAt + this.endedTime, "YYYY-MM-DDHH:mm").isAfter(
          this.$Moment(
            this.startedAt + this.startedTime,
            "YYYY-MM-DDHH:mm"
          ).subtract(1, "days")
        ) &&
        this.$Moment(this.endedAt + this.endedTime, "YYYY-MM-DDHH:mm").isBefore(
          this.$Moment(
            this.resultedAt + this.resultedTime,
            "YYYY-MM-DDHH:mm"
          ).add(1, "days")
        );
      if (!result) {
        this.endedAtErrors = "สิ้นสุดเมื่อ ไม่ถูกต้อง";
      }
      return result;
    },
    validateResultedAt() {
      this.resultedAtErrors = null;
      if (!this.resultedAt) {
        this.resultedAtErrors = "กรุณาเลือก ออกผลเมื่อ";
        return false;
      }
      const result = this.$Moment(
        this.resultedAt + this.resultedTime,
        "YYYY-MM-DDHH:mm"
      ).isAfter(
        this.$Moment(this.endedAt + this.endedTime, "YYYY-MM-DDHH:mm").subtract(
          1,
          "days"
        )
      );
      if (!result) {
        this.resultedAtErrors = "ออกผลเมื่อ ไม่ถูกต้อง";
      }
      return result;
    },
    validateDate() {
      let result = this.validateStartedAt();
      result &= this.validateEndedAt();
      result &= this.validateResultedAt();
      return result;
    },
    onStartedAtChange() {
      this.$refs.startedAtDialog.save(this.startedAt);
      this.validateDate();
    },
    onEndedAtChange() {
      this.$refs.endedAtDialog.save(this.endedAt);
      this.validateDate();
    },
    onResultedAtChange() {
      this.$refs.resultedAtDialog.save(this.resultedAt);
      this.validateDate();
    },
    async onSubmitClicked() {
      console.log("submit click");
      // let validate = await this.$refs.observer.validate();
      // if (!validate) {
      //   return;
      // }
      // if (this.add) {
      //   validate &= this.validateDate();
      //   if (!validate) {
      //     return;
      //   }
      //   await this.addLotto();
      // } else {
      //   await this.updateProductConfig();
      // }
    },
    async addLotto() {
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
        name: this.name,
        thaiName: this.thaiName,
        type: this.type,
        startedAt: this.$Moment(
          this.startedAt + this.startedTime,
          "YYYY-MM-DDHH:mm"
        ).toDate(),
        endedAt: this.$Moment(
          this.endedAt + this.endedTime,
          "YYYY-MM-DDHH:mm"
        ).toDate(),
        resultedAt: this.$Moment(
          this.resultedAt + this.resultedTime,
          "YYYY-MM-DDHH:mm"
        ).toDate(),
        productLottoId: this.$route.params.id,
        status: "ENABLE",
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
      await createLotto(req);
      this.$Swal.fire("เพิ่ม", "เพิ่มสินค้าสำเร็จ", "success");
      this.$router.back();
    },
    async updateProductConfig() {
      let req = {};
      if (this.main) {
        let iconType = "normal";
        let iconName = "account_balance";
        if (this.icon) {
          iconType = "flag";
          iconName = this.icon;
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
          code: this.code,
          iconName: iconName,
          iconType: iconType,
          startedTime: this.startedTime,
          endedTime: this.endedTime,
          resultedTime: this.resultedTime,
          openPlayBeforeResultedAtInDays: this.openPlayBeforeResultedAtInDays,

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
          await createOrUpdateRisks(risks);

          if (result.value) {
            await updateLottoByProductId(this.$route.params.id, {
              minimumByRound: this.minimumByRound,
              maximumByRound: this.maximumByRound,
              minimumByItems: this.minimumByItems,
              maximumByItems: this.maximumByItems,
              maximumByNumbers: this.maximumByNumbers,
              productConfig: {
                ...this.product,
                ...req,
                risks: risks
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
        let minimumByRound = null;
        if (this.minimumByRound) {
          minimumByRound = this.minimumByRound;
        }
        let maximumByRound = null;
        if (this.minimumByRound) {
          maximumByRound = this.maximumByRound;
        }
        req = {
          name: this.name,
          thaiName: this.thaiName,
          startedAt: this.$Moment(
            this.startedAt + this.startedTime,
            "YYYY-MM-DDHH:mm"
          ).toDate(),
          endedAt: this.$Moment(
            this.endedAt + this.endedTime,
            "YYYY-MM-DDHH:mm"
          ).toDate(),
          resultedAt: this.$Moment(
            this.resultedAt + this.resultedTime,
            "YYYY-MM-DDHH:mm"
          ).toDate(),
          minimumByRound: minimumByRound,
          maximumByRound: maximumByRound,
          minimumByItems: this.minimumByItems,
          maximumByItems: this.maximumByItems,
          maximumByNumbers: this.maximumByNumbers,
          productConfig: {
            ...this.product,
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
    },
    async fetchLottoLimitNumber() {
      this.lottoLimitNumbers = await getLottoLimitNumbers(
        "?lottoId=" + this.$route.params.id
      );
    },
    onAddNumberLimitClicked() {
      this.$refs.lottoLimitNumberDialog.open(this.lotto._id.toString());
    },
    async onDeleteLottoLimitNumberClicked(id) {
      const result = await this.$Swal.fire({
        title: this.$t("are_you_sure"),
        html: this.$t("are_you_sure_delete_limit_number"),
        icon: "warning",
        showCancelButton: true
      });
      if (result.value) {
        try {
          await deleteLottoLimitNumber(id.toString());
          this.fetchLottoLimitNumber();
        } catch (error) {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("delete_limit_number_error"),
            "error"
          );
        }
      }
    },
    onLottoLimitNumberAfterSaved(data) {
      this.fetchLottoLimitNumber();
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
