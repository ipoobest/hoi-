<template>
  <div>
    <template v-for="(item, index) in items">
      <YeeKeeCard
        :key="index"
        :item="item"
        :local-time="localTime"
        :system-time="systemTime"
      />
    </template>
  </div>
</template>

<script>
import { getSystemTime } from "@/api/system.js";
import { getYeekeeToday } from "@/api/lotto.js";
import YeeKeeCard from "@/product/components/YeekeeCard";
export default {
  components: {
    YeeKeeCard
  },
  data: () => ({
    items: []
  }),
  created() {
    this.$EventBus.$emit("showLoading");
    getYeekeeToday().then(res => {
      getSystemTime().then(time => {
        this.systemTime = time;
        this.localTime = this.$Moment();
        this.items = this.$_.sortBy(res, ["id"]);
        this.$EventBus.$emit("hideLoading");
      });
    });
  },
  methods: {
    statusFormater(status) {
      if (status === "CLOSE") {
        return "ปิดรับแทง";
      } else {
        return status;
      }
    }
  }
};
</script>

<style scoped>
div[class^="col"] {
  padding: 12px 6px 0 6px;
}

.inside-col {
  padding: 0 12px;
}

.card-hover {
  border-left: thin solid #ea4650 !important;
  border-top: thin solid #ea4650 !important;
  border-right: thin solid #ea4650 !important;
}
</style>
