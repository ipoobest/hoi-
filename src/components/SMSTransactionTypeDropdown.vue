<template>
  <v-select
    v-model="select"
    :items="items"
    :label="label"
    item-text="label"
    item-value="value"
    :error-messages="errors"
    chips
    multiple
    attach
    :readonly="readonly"
    :disabled="disabled"
    @change="onChange"
  >
  </v-select>
</template>

<script>
import { smsTransactionTypes } from "@/utils/SMSTransactionTypeFormatter";
export default {
  name: "SMSTransactionTypeDropdown",
  props: {
    value: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: "ประเภท"
    },
    icon: {
      type: String,
      default: "swap_horizontal_circle"
    },
    errors: {
      type: Array,
      default: null
    },
    readonly: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    defaultItems: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    select: [
      "AUTO",
      "SINGLE",
      "MANY",
      "FORGET_PASSWORD",
      "PHONE_VERIFY",
      "CHANGE_PHONE"
    ],
    items: []
  }),
  created() {
    this.onLocaleChanged();
    if (this.defaultItems) {
      const newItems = [];
      this.$_.forEach(this.defaultItems, d => {
        const item = this.$_.find(this.items, i => i.value === d);
        if (item) {
          newItems.push(item);
        }
      });
      this.items = newItems;
    }
    if (this.value) {
      const newValue = [];
      this.$_.forEach(this.value, v => {
        const defaultValue = this.$_.find(this.items, o => o.value === v);
        if (defaultValue) {
          newValue.push(defaultValue);
        }
      });
      this.select = newValue;
    }
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.items = [];
      this.$_.forOwn(smsTransactionTypes, (value, key) => {
        this.items.push({
          label: this.$t(value),
          value: key
        });
      });
    },
    onChange(value) {
      this.$emit("input", value);
    }
  }
};
</script>
