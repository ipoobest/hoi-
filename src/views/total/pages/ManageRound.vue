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
                  {{ $t("yeekee_list") }}
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
              </v-col>
            </v-row>
          </template>

          <v-row>
            <a href="#" class="pl-5 pt-5 pb-5" @click="$router.back()">{{
              $t("back")
            }}</a>
          </v-row>

          <div class="px-2">
            <YeekeeLayout v-if="product.type === 'YEEKEE'" />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { getProductById } from "@/api/productLotto.js";
import YeekeeLayout from "@/views/total/components/YeekeeLayout";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "ManageRound",
  components: {
    YeekeeLayout
  },
  data() {
    return {
      getLangNameKeyFromLocale,
      product: {},
      remeaningTime: 60
    };
  },
  computed: {
    locale: get("global/locale")
  },
  created() {
    getProductById(this.$route.params.id).then(product => {
      this.product = product;
    });
    this.createWorker();
  },
  methods: {
    onRefreshClicked() {
      this.$EventBus.$emit("onTotalYeekeeRefresh");
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
