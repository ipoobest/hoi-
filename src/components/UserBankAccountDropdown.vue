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
import { getUserBankAccounts } from "@/api/userBankAccount.js";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
Object.freeze(getLangNameKeyFromLocale);

export default {
  name: "UserBankAccountDropdown",
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
    userId: {
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
  watch: {
    userId(userId) {
      if (userId) {
        this.fetchUserBankAccounts(userId);
      } else {
        this.select = null;
        this.items = [];
      }
    }
  },
  created() {
    this.formatter = new StringMask("000-0-00000-0000-0");
  },
  methods: {
    fetchUserBankAccounts(userId) {
      const req = `&userId=${userId}`;
      getUserBankAccounts(undefined, undefined, undefined, undefined, req).then(
        banks => {
          this.items = banks;
        }
      );
    },
    displayText(value) {
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
