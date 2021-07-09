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
  >
    <v-icon slot="prepend">{{ icon }}</v-icon>
  </v-select>
</template>

<script>
import { get } from "vuex-pathify";
export default {
  name: "AdminRoleSingleDropdown",
  props: {
    value: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: "บทบาท"
    },
    icon: {
      type: String,
      default: "mdi-account-star"
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
    }
  },
  data: () => ({
    select: null,
    items: []
  }),
  computed: {
    me: get("auth/me")
  },
  watch: {
    value(value) {
      const defaultValue = this.$_.find(this.items, o => o.value === value);
      this.select = defaultValue;
    }
  },
  created() {
    this.onLocaleChanged();
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
      if (this.me.role.name === "Partner") {
        this.items = [
          {
            label: this.$t("approver"),
            value: "Approver"
          },
          {
            label: this.$t("super_admin"),
            value: "Super Admin"
          }
        ];
      } else {
        this.items = [
          {
            label: this.$t("modulator"),
            value: "Modulator"
          },
          {
            label: this.$t("partner"),
            value: "Partner"
          },
          {
            label: this.$t("super_admin"),
            value: "Super Admin"
          },
          {
            label: this.$t("approver"),
            value: "Approver"
          }
        ];
      }
    },
    onChange(value) {
      this.$emit("input", value);
    }
  }
};
</script>
