<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("add_product") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("add_product") }}
            </div>
          </template>

          <v-row>
            <a href="#" class="pl-5 pt-5 pb-5" @click="$router.back()">{{
              $t("back")
            }}</a>
          </v-row>

          <div class="pt-2">
            <v-card class="my-0" style="height: 50%;">
              <v-card-title class="subheading font-weight-bold">
                <v-icon left color="success">
                  mdi-plus-circle
                </v-icon>
                {{ $t("risk_setting") }}
              </v-card-title>
              <v-divider></v-divider>
              <v-row class="d-flex justify-center">
                <v-col cols="12" md="6">
                  <validation-observer ref="observer">
                    <v-container class="py-0">
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('product_en')"
                        rules="required"
                      >
                        <v-text-field
                          v-model="name"
                          :label="$t('product_en')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-gamepad-variant</v-icon>
                        </v-text-field>
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('product_th')"
                        rules="required"
                      >
                        <v-text-field
                          v-model="thaiName"
                          :label="$t('product_th')"
                          :error-messages="errors"
                        >
                          <v-icon slot="prepend">mdi-gamepad-variant</v-icon>
                        </v-text-field>
                      </validation-provider>

                      <LottoTypeDropdownWithValidation
                        v-model="type"
                        :label="$t('product_type')"
                        :name="$t('product_type')"
                        rules="required"
                        :excepts="['YEEKEE']"
                      />

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

                      <v-divider class="mt-2" />

                      <v-row>
                        <v-col class="pb-0">
                          <v-btn
                            type="button"
                            color="grey"
                            block
                            @click="onResetClicked"
                            ><v-icon left>refresh</v-icon
                            ><strong>{{ $t("reset_factory") }}</strong></v-btn
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
              </v-row>
            </v-card>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { withValidation } from "vee-validate";

import { createProductLotto } from "@/api/productLotto.js";
import LottoTypeDropdown from "@/components/LottoTypeDropdown";

const LottoTypeDropdownWithValidation = withValidation(LottoTypeDropdown);

export default {
  name: "AddProductLotto",
  components: {
    LottoTypeDropdownWithValidation
  },
  data() {
    return {
      processing: false,
      name: null,
      thaiName: null,
      type: null,
      icon: null,
      code: null,
      minimumByRound: null,
      maximumByRound: null
    };
  },
  created() {},
  methods: {
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
    onResetClicked() {
      this.$refs.observer.reset();
      this.name = null;
      this.thaiName = null;
      this.type = null;
      this.icon = null;
      this.code = null;
    },
    async onSubmitClicked() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }

      this.processing = true;
      let iconType = "normal";
      let iconName = "account_balance";
      if (this.icon) {
        iconType = "flag";
        iconName = this.icon;
      }
      const data = {
        name: this.name,
        thaiName: this.thaiName,
        iconType: iconType,
        iconName: iconName,
        type: this.type,
        paidType: "DYNAMIC",
        code: this.code,
        minimumByRound: this.minimumByRound,
        maximumByRound: this.maximumByRound
      };
      try {
        await createProductLotto(data);
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
