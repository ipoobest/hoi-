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
import StringMask from "string-mask";
import { getCompanyBankAccounts } from "@/api/companyBankAccount.js";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
Object.freeze(getLangNameKeyFromLocale);

export default {
  name: "CompanyBankAccountDropdown",
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
    },
    type: {
      type: String,
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
    this.formatter = new StringMask("000-0-00000-0000-0");
    let params = "?status=APPROVED&active=true";
    if (this.type === "PAY") {
      params += "&type=PAY&type=BOTH";
    } else if (this.type === "RECEIVE") {
      params += "&type=RECEIVE&type=BOTH";
    }
    getCompanyBankAccounts(params).then(banks => {
      this.items = banks;
    });
  },
  methods: {
    displayText(value) {
      if (this.locale)
        return `${value.bank.shortName.toUpperCase()} : ${
          value.bank[getLangNameKeyFromLocale(this.locale)]
        } : ${this.formatter.apply(value.accountCode)}`;
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
