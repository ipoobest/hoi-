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
import { get } from "vuex-pathify";
export default {
  name: "AdminRoleDropdown",
  props: {
    value: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: "บทบาท"
    },
    errors: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    select: [],
    items: []
  }),
  computed: {
    me: get("auth/me")
  },
  created() {
    if (this.me.role.name === "Partner") {
      this.select = ["Super Admin", "Approver"];
    } else {
      this.select = ["Modulator", "Partner", "Super Admin", "Approver"];
    }
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
      if (this.me.role.name === "Partner") {
        this.items = [
          {
            label: this.$t("super_admin"),
            value: "Super Admin"
          },
          {
            label: this.$t("approver"),
            value: "Approver"
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
