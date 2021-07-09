<template>
  <v-select
    v-model="select"
    :value="value"
    :items="items"
    :label="label"
    item-text="label"
    item-value="value"
    :error-messages="errors"
    required
    @blur="onBlur"
    @change="onChange"
  >
    <v-icon slot="prepend">{{ icon }}</v-icon>
  </v-select>
</template>

<script>
export default {
  name: "PaymentChannelDropdown",
  props: {
    value: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: "ช่องทางการชำระเงิน"
    },
    icon: {
      type: String,
      default: "swap_horizontal_circle"
    },
    errors: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    select: null,
    items: [
      {
        label: "ATM",
        value: "ATM"
      },
      {
        label: "Internet Banking",
        value: "INTERNET_BANKING"
      },
      {
        label: "Mobile Banking",
        value: "MOBILE_BANKING"
      }
    ]
  }),
  methods: {
    onBlur() {
      this.$emit("input", this.select);
    },
    onChange(value) {
      this.$emit("input", value);
    }
  }
};
</script>
