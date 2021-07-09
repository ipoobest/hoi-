<template>
  <v-select
    v-model="select"
    :value="value"
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
    select: ["WAITING", "APPROVED", "REJECTED", "DELETED"],
    items: [
      {
        label: "รออนุมัติ",
        value: "WAITING"
      },
      {
        label: "อนุมัติ",
        value: "APPROVED"
      },
      {
        label: "ปฏิเสธ",
        value: "REJECTED"
      },
      {
        label: "ถูกลบ",
        value: "DELETED"
      }
    ]
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
          label: this.$t("waiting-approve"),
          value: "WAITING"
        },
        {
          label: this.$t("approved"),
          value: "APPROVED"
        },
        {
          label: this.$t("rejected"),
          value: "REJECTED"
        },
        {
          label: this.$t("deleted"),
          value: "DELETED"
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
