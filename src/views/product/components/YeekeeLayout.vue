<template>
  <div>
    <v-row class="px-2">
      <validation-observer ref="observer">
        <form @submit.prevent="onSubmit">
          <v-container class="pa-0">
            <v-row>
              <v-col class="py-0">
                <v-radio-group
                  v-model="filterOption"
                  row
                  class="pa-0 ma-0"
                  hide-details
                >
                  <span class="pr-2 my-auto">{{ $t("filter_by") }}</span>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0">
                <v-dialog
                  ref="filterDateDialog"
                  v-model="filterDateModal"
                  :return-value.sync="filterDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filterDate"
                      :label="$t('round_date')"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="filterDate"
                    scrollable
                    locale="locale"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="filterDateModal = false"
                      >{{ $t("cancel") }}</v-btn
                    >
                    <v-btn text color="primary" @click="onFilterDateChange">{{
                      $t("ok")
                    }}</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </form>
      </validation-observer>
    </v-row>
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
import YeeKeeCard from "@/views/product/components/YeekeeCard";
export default {
  components: {
    YeeKeeCard
  },
  data: () => ({
    items: [],
    filterDateModal: false,
    filterDate: null
  }),
  computed: {
    locale: get("global/locale")
  },
  created() {
    let filterDate = this.$Moment();
    const checker = this.$Moment()
      .hours(4)
      .minutes(59)
      .seconds(59)
      .milliseconds(59);
    if (filterDate.isBefore(checker)) {
      filterDate = filterDate.subtract(1, "days");
    }
    this.filterDate = filterDate.format("YYYY-MM-DD");
    this.getData(this.filterDate);
  },
  methods: {
    getData(filterDate) {
      this.$EventBus.$emit("showLoading");
      getYeekeeToday(filterDate).then(res => {
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
    },
    onFilterDateChange() {
      this.$refs.filterDateDialog.save(this.filterDate);
      this.getData(this.filterDate);
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
