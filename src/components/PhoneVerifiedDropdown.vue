<template>
  <v-select
    v-model="select"
    :items="items"
    :label="label"
    item-text="label"
    item-value="value"
    :error-messages="errors"
    :readonly="readonly"
    :disabled="disabled"
    @blur="onBlur"
    @change="onChange"
  >
    <v-icon v-if="icon" slot="prepend">{{ icon }}</v-icon>
  </v-select>
</template>

<script>
export default {
  name: "PhoneVerifiedDropdown",
  props: {
    value: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: "ยืนยันเบอร์โทรศัพท์"
    },
    errors: {
      type: Array,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    select: null,
    items: []
  }),
  watch: {
    value(value) {
      if (this.value !== null || this.value !== undefined) {
        this.select = this.value;
      }
    }
  },
  created() {
    this.onLocaleChanged();
    if (this.value !== null || this.value !== undefined) {
      this.select = this.value;
    }
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.items = [
        {
          label: this.$t("all"),
          value: null
        },
        {
          label: this.$t("approved"),
          value: true
        },
        {
          label: this.$t("waiting_approve"),
          value: false
        }
      ];
    },
    onBlur() {
      if (this.select === null) {
        this.$emit("input", null);
      }
    },
    onChange(value) {
      this.$emit("input", value);
    }
  }
};
</script>
