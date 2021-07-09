<template>
  <v-select
    v-model="select"
    :value="value"
    :items="items"
    :label="label"
    :item-text="displayText"
    :item-value="selectValue"
    :error-messages="errors"
    required
    @blur="onBlur"
    @change="onChange"
  >
    <v-icon slot="prepend">{{ icon }}</v-icon>
  </v-select>
</template>

<script>
import { get } from "vuex-pathify";
import { getBanks } from "@/api/bank.js";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
Object.freeze(getLangNameKeyFromLocale);

export default {
  name: "BankDropdown",
  props: {
    value: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: "บัญชีธนาคาร"
    },
    icon: {
      type: String,
      default: "account_balance"
    },
    errors: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    select: null,
    items: []
  }),
  computed: {
    locale: get("global/locale")
  },
  created() {
    getBanks("?deprecate=false").then(banks => {
      this.items = banks;
    });
  },
  methods: {
    displayText(value) {
      return `${value.shortName.toUpperCase()} : ${
        value[getLangNameKeyFromLocale(this.locale)]
      }`;
    },
    selectValue(value) {
      return value;
    },
    onBlur() {
      this.$emit("input", this.select);
    },
    onChange(value) {
      this.$emit("input", value);
    }
  }
};
</script>
