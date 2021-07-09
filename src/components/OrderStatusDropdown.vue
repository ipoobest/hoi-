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
  name: "OrderStatusDropdown",
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
    select: ["WAITING", "FINISHED", "CANCELLED"],
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
          label: this.$t("waiting_announce"),
          value: "WAITING"
        },
        {
          label: this.$t("announced"),
          value: "FINISHED"
        },
        {
          label: this.$t("cancelled"),
          value: "CANCELLED"
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
