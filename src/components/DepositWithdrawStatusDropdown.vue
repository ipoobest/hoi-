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
  name: "DepositWithdrawStatusDropdown",
  props: {
    value: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: "สถานะ"
    },
    errors: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    select: [
      "OPEN",
      "IN_REVIEW",
      "IN_PROGRESS",
      "WITHDRAWAL",
      "APPROVED",
      "AUTO_APPROVED",
      "AUTO_REJECTED",
      "REJECTED"
    ],
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
          label: this.$t("open"),
          value: "OPEN"
        },
        {
          label: this.$t("waiting-approve"),
          value: "IN_REVIEW"
        },
        {
          label: this.$t("processing"),
          value: "IN_PROGRESS"
        },
        {
          label: this.$t("withdrawing"),
          value: "WITHDRAWAL"
        },
        {
          label: this.$t("approved"),
          value: "APPROVED"
        },
        {
          label: this.$t("auto-approved"),
          value: "AUTO_APPROVED"
        },
        {
          label: this.$t("auto-rejected"),
          value: "AUTO_REJECTED"
        },
        {
          label: this.$t("rejected"),
          value: "REJECTED"
        }
      ];
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
