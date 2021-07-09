<template>
  <v-select
    :items="items"
    :label="label"
    hide-details
    clearable
    @change="onChange"
  />
</template>

<script>
import { getRejectReasons } from "@/api/rejectReason.js";

export default {
  props: {
    label: {
      type: String,
      default: "เหตุผลในการปฎิเสธ"
    }
  },
  data: () => ({
    items: []
  }),
  created() {
    this.fetchRejectReasons();
  },
  methods: {
    fetchRejectReasons() {
      const params = "?active=true";
      getRejectReasons(params)
        .then(res => {
          this.items = res.map(item => item.name);
        })
        .catch(err => {
          this.$Swal.fire("ผิดพลาด", "ไม่สามารถรับเหตุผลในการปฎิเสธ", "error");
        });
    },
    onChange(value) {
      this.$emit("input", value);
    }
  }
};
</script>
