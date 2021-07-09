<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ lotto[getLangNameKeyFromLocale(locale)] }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("product_setting") }}
              {{ lotto[getLangNameKeyFromLocale(locale)] }}
            </div>
          </template>

          <v-row>
            <a href="#" class="pl-5 pt-5 pb-5" @click="$router.back()">{{
              $t("back")
            }}</a>
          </v-row>

          <div class="pt-2">
            <YeekeeSetting v-if="lotto.type === 'YEEKEE'" :main="false" />
            <LottoSetting
              v-if="lotto.type === 'LOTTO' || lotto.type === 'STOCK'"
              :main="false"
            />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { getLottoById } from "@/api/lotto.js";
import YeekeeSetting from "@/views/product/components/YeekeeSetting";
import LottoSetting from "@/views/product/components/LottoSetting";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "Setting",
  components: {
    YeekeeSetting,
    LottoSetting
  },
  data() {
    return {
      getLangNameKeyFromLocale,
      lotto: {}
    };
  },
  computed: {
    locale: get("global/locale")
  },
  created() {
    getLottoById(this.$route.params.id).then(lotto => {
      this.lotto = lotto;
    });
  }
};
</script>
