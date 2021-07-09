<template>
  <div>
    <v-row class="px-2">
      <validation-observer ref="observer" tag="div" style="width: 100%;">
        <form @submit.prevent="onSubmit">
          <v-row class="pa-0">
            <v-col class="py-0" cols="12" sm="12">
              <v-radio-group
                v-model="filterOption"
                row
                class="pa-0 ma-0"
                hide-details
              >
                <span class="pr-2 my-auto">{{ $t("filter_by") }}</span>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="3">
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
                <v-date-picker v-model="filterDate" scrollable :locale="locale">
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
            <v-col cols="12" sm="3" align-self="center">
              <v-btn small color="grey" @click="onClearFilter"
                ><strong>{{ $t("clear") }}</strong></v-btn
              >
            </v-col>
            <v-col cols="12" sm="6" justify="center" align-self="center">
              <div class="text-right">
                <v-btn
                  class="mr-1"
                  color="primary"
                  dark
                  :to="`/product/lotto/${$route.params.id}/add`"
                >
                  <v-icon dark left>add</v-icon><strong>{{ $t("add") }}</strong>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </form>
      </validation-observer>
    </v-row>
    <v-row>
      <template v-for="(item, index) in items">
        <LottoCard
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
import { getLottoByProdcutIdAndDate } from "@/api/lotto.js";
import LottoCard from "@/views/product/components/LottoCard";
export default {
  components: {
    LottoCard
  },
  props: {
    product: {
      type: Object,
      required: true
    }
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
    this.getData(this.$route.params.id, this.filterDate);
    this.$EventBus.$on("onLottoLayoutRefresh", this.onLottoLayoutRefresh);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLottoLayoutRefresh", this.onLottoLayoutRefresh);
  },
  methods: {
    getData(productLottoId, filterDate) {
      this.$EventBus.$emit("showLoading");
      getLottoByProdcutIdAndDate(
        productLottoId,
        this.product.type,
        filterDate,
        100
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
    },
    onFilterDateChange() {
      this.$refs.filterDateDialog.save(this.filterDate);
      this.getData(this.$route.params.id, this.filterDate);
    },
    onClearFilter() {
      this.filterDate = null;
      this.$refs.filterDateDialog.save(this.filterDate);
      this.getData(this.$route.params.id);
    },
    onLottoLayoutRefresh() {
      this.getData(this.$route.params.id, this.filterDate);
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
