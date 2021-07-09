<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ product[getLangNameKeyFromLocale(locale)] }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("manage_round") }}
              {{ product[getLangNameKeyFromLocale(locale)] }}
            </div>
          </template>

          <v-row>
            <a href="#" class="pl-5 pt-5 pb-5" @click="$router.back()">{{
              $t("back")
            }}</a>
          </v-row>

          <div class="px-2">
            <YeekeeLayout v-if="product.type === 'YEEKEE'" />
            <LottoLayout
              v-else-if="product.type === 'LOTTO' || product.type === 'STOCK'"
              :product="product"
            />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { getProductById } from "@/api/productLotto.js";
import YeekeeLayout from "@/views/product/components/YeekeeLayout";
import LottoLayout from "@/views/product/components/LottoLayout";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "ManageRound",
  components: {
    YeekeeLayout,
    LottoLayout
  },
  data() {
    return {
      getLangNameKeyFromLocale,
      product: {}
    };
  },
  computed: {
    locale: get("global/locale")
  },
  created() {
    getProductById(this.$route.params.id).then(product => {
      this.product = product;
    });
  }
};
</script>
