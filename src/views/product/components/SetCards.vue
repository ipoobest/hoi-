<template>
  <div>
    <v-icon left>subscriptions</v-icon>
    <h2 style="display: inline;">{{ $t("lotto_set") }}</h2>
    <v-row align="stretch" justify="start">
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="12"
        sm="3"
        md="3"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card
            class="mx-auto"
            outlined
            raised
            :to="`/product/lotto/${item._id}`"
            :class="{ 'card-hover': hover }"
            style="min-width: 200px;"
          >
            <v-list-item>
              <v-list-item-content>
                <v-row align-self="stretch">
                  <v-col
                    class="inside-col"
                    cols="12"
                    sm="12"
                    md="12"
                    align-self="stretch"
                  >
                    <span class="text-center">
                      <flag
                        v-if="item.iconType === 'flag'"
                        :iso="item.iconName"
                        style="margin-right: 0.5rem;"
                      /><strong
                        class="text-center"
                        style="font-size: 1rem; color: #ea4650;"
                        >{{ item[getLangNameKeyFromLocale(locale)] }}</strong
                      ></span
                    >
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-card style="min-width: 200px;"> </v-card>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-card style="min-width: 200px;"> </v-card>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-card style="min-width: 200px;"> </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { getProductSet } from "@/api/productLotto";
import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
export default {
  data: () => ({
    getLangNameKeyFromLocale,
    items: []
  }),
  computed: {
    locale: get("global/locale")
  },
  created() {
    getProductSet().then(items => {
      this.items = items;
    });
  }
};
</script>

<style scoped>
div[class^="col"] {
  padding: 0 6px !important;
  height: 80px;
}

.inside-col {
  padding: 0 12px;
}

.card-hover {
  border: thin solid #ea4650 !important;
}
</style>
