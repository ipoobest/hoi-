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
    :readonly="readonly"
    :disabled="disabled"
    @change="onChange"
    @blur="onBlur"
  >
    <v-icon v-if="icon" slot="prepend">{{ icon }}</v-icon>
  </v-select>
</template>

<script>
export default {
  name: "LottoTypeDropdown",
  props: {
    value: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: "ประเภทสินค้า"
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
    all: {
      type: Boolean,
      required: false
    },
    excepts: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    select: null,
    items: []
  }),
  watch: {
    value(value) {
      const defaultValue = this.$_.find(this.items, o => o.value === value);
      this.select = defaultValue;
    }
  },
  created() {
    this.onLocaleChanged();
    if (this.excepts) {
      this.$_.forEach(this.excepts, e => {
        this.$_.remove(this.items, i => i.value === e);
      });
    }

    if (this.value) {
      const defaultValue = this.$_.find(
        this.items,
        o => o.value === this.value
      );
      this.select = defaultValue;
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
          label: this.$t("lotto_yeekee"),
          value: "YEEKEE"
        },
        {
          label: this.$t("lotto"),
          value: "LOTTO"
        },
        {
          label: this.$t("lotto_set"),
          value: "SET"
        },
        {
          label: this.$t("lotto_foreign_stock"),
          value: "STOCK"
        }
      ];
      if (this.all) {
        this.items = [
          {
            label: this.$t("all"),
            value: null
          }
        ].concat(this.items);
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
