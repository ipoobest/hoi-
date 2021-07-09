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
    @blur="onBlur"
    @change="onChange"
  >
  </v-select>
</template>

<script>
export default {
  name: "DepositWithdrawTypeDropdown",
  props: {
    value: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: "ประเภท"
    },
    isBank: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    select: ["DEPOSIT", "WITHDRAWAL", "ADJUSTMENT"],
    items: []
  }),
  created() {
    this.onLocaleChanged();
    if (this.value) {
      this.select = this.value;
    }
    this.$emit("input", this.select);

    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.items = [
        {
          label: this.$t("deposit"),
          value: "DEPOSIT"
        },
        {
          label: this.$t("withdrawal"),
          value: "WITHDRAWAL"
        },
        {
          label: this.$t("adjustment2"),
          value: "ADJUSTMENT"
        }
      ];
      if (this.isBank) {
        this.items.splice(2, 1);
      }
    },
    onBlur() {
      if (!this.select) {
        this.$emit("input", null);
      }
    },
    onChange(value) {
      this.$emit("input", value);
    }
  }
};
</script>
