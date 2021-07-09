<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("outstanding") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("outstanding_subtitle") }}
                </div></v-col
              >
              <v-col class="py-0 text-right">
                <v-hover v-slot:default="{ hover }">
                  <v-btn
                    fab
                    small
                    color="warning"
                    class="mr-2"
                    @click="onRefreshClicked"
                  >
                    <v-icon v-if="hover" large>mdi-refresh</v-icon>
                    <h2 v-else-if="remeaningTime > 0">{{ remeaningTime }}</h2>
                    <v-icon v-else large>mdi-refresh</v-icon>
                  </v-btn>
                </v-hover>
                <v-btn
                  fab
                  small
                  color="green"
                  class="mr-2"
                  @click="$router.push('/product/lotto/add')"
                >
                  <v-icon large>mdi-plus-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <div class="px-4">
            <v-row>
              <LottoCards />
            </v-row>
            <v-row>
              <StockCards />
            </v-row>
            <v-row>
              <SetCards />
            </v-row>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LottoCards from "@/views/total/components/LottoCards";
import StockCards from "@/views/total/components/StockCards";
import SetCards from "@/views/total/components/SetCards";

export default {
  components: {
    LottoCards,
    StockCards,
    SetCards
  },
  data: () => ({
    remeaningTime: 60
  }),
  created() {
    this.createWorker();
  },
  beforeDestroy() {
    if (this.worker) {
      clearInterval(this.worker);
      this.worker = null;
    }
  },
  methods: {
    onRefreshClicked() {
      this.$EventBus.$emit("onTotalLottoRefresh");
      this.$EventBus.$emit("onTotalStockRefresh");
      this.remeaningTime = 60;
    },
    createWorker() {
      this.worker = setInterval(() => {
        if (this.remeaningTime === 0) {
          this.remeaningTime = 60;
          this.onRefreshClicked();
        }
        --this.remeaningTime;
      }, 1000);
    }
  }
};
</script>
