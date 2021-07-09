<template>
  <div>
    <v-row>
      <template v-for="(item, index) in items">
        <YeeKeeCard
          :key="index"
          :item="item"
          :local-time="localTime"
          :system-time="systemTime"
        />
      </template>
    </v-row>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { getSystemTime } from "@/api/system.js";
import { getYeekeeToday } from "@/api/lotto.js";
import YeeKeeCard from "@/views/report/components/YeekeeCard";
export default {
  components: {
    YeeKeeCard
  },
  data: () => ({
    items: []
  }),
  computed: {
    locale: get("global/locale"),
    overallFilterDate: get("global/overallFilterDate")
  },
  created() {
    if (!this.overallFilterDate) {
      this.$router.back();
      return;
    }
    this.filterDate = this.$Moment(this.overallFilterDate, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    this.onTotalYeekeeRefresh();
  },
  methods: {
    onTotalYeekeeRefresh() {
      this.getData(this.filterDate);
    },
    getData(filterDate) {
      this.$EventBus.$emit("showLoading");
      getYeekeeToday(
        filterDate,
        "&status=ENABLE&finished=true",
        "finished:ASC,round:DESC"
      ).then(res => {
        getSystemTime().then(time => {
          // clear round cache to force YeekeeCard created lifecycle
          this.items = [];
          this.$nextTick(() => {
            this.systemTime = time;
            this.localTime = this.$Moment();
            this.items = res;
            this.$EventBus.$emit("hideLoading");
          });
        });
      });
    }
  }
};
</script>

<style scoped>
div[class^="col"] {
  padding: 0px 6px 0 6px;
}

.inside-col {
  padding: 0 12px;
}

.card-hover {
  border: thin solid #ea4650 !important;
}
</style>
