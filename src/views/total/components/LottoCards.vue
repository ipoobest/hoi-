<template>
  <v-col>
    <v-icon left>local_play</v-icon>
    <h2 style="display: inline">{{ $t("lottos") }}</h2>
    <v-row>
      <template v-for="(item, index) in items">
        <v-col
          v-if="item.type === 'YEEKEE' || (item.lotto && !item.lotto.finished)"
          :key="index"
          cols="12"
          sm="6"
          md="3"
        >
          <v-hover v-slot:default="{ hover }">
            <v-card
              outlined
              raised
              :class="{ 'card-hover': hover }"
              class="my-2"
            >
              <v-list-item
                :to="item.type === 'YEEKEE' ? `/total/lotto/${item._id}` : ''"
              >
                <v-list-item-content>
                  <v-row align="stretch">
                    <v-col
                      class="inside-col"
                      cols="12"
                      sm="12"
                      md="12"
                      align-self="stretch"
                    >
                      <v-icon v-if="item.iconType === 'normal'" left>{{
                        item.iconName
                      }}</v-icon>
                      <flag
                        v-else-if="item.iconType === 'flag'"
                        :iso="item.iconName"
                        :squared="false"
                        style="margin-right: 0.5rem"
                      />
                      <strong
                        class="text-left"
                        style="
                          font-size: 1rem;
                          color: #ea4650;
                          line-height: 1.5rem;
                        "
                        >{{ item[getLangNameKeyFromLocale(locale)] }}</strong
                      ></v-col
                    >
                    <v-col class="inside-col" cols="6" sm="12" md="12">
                      <div class="text-right">
                        <h1 v-if="item.lotto">
                          {{
                            $Numeral(item.lotto.totalAmount).format("0,0.00")
                          }}
                        </h1>
                        <h1 v-else class="white--text">.</h1>
                      </div>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  v-if="item.type !== 'YEEKEE'"
                  class="mr-0"
                  color="info"
                  small
                  :to="`/total/lotto/types/${item.lotto.lottoId}`"
                >
                  <strong>{{ $t("amount_by_type") }}</strong>
                </v-btn>
                <v-btn
                  v-if="item.type !== 'YEEKEE'"
                  class="mr-0"
                  color="success"
                  small
                  :to="`/total/lotto/numbers/${item.lotto.lottoId}`"
                >
                  <strong>{{ $t("amount_by_number") }}</strong>
                </v-btn>
                <v-btn
                  v-if="item.type !== 'YEEKEE'"
                  class="mr-0"
                  color="red"
                  small
                  :to="`/total/lotto/members/${item.lotto.lottoId}`"
                >
                  <strong>{{ $t("amount_by_member") }}</strong>
                </v-btn>
                <v-btn
                  v-if="item.type === 'YEEKEE'"
                  class="mr-0"
                  color="red"
                  small
                  :to="`/total/lotto/${item._id}`"
                >
                  <strong>{{ $t("manage_round") }}</strong>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
  </v-col>
</template>

<script>
import { get } from "vuex-pathify";
import { getAvailableLotto } from "@/api/productLotto";
import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
Object.freeze(getLangNameKeyFromLocale);
export default {
  data: () => ({
    getLangNameKeyFromLocale,
    items: []
  }),
  computed: {
    locale: get("global/locale")
  },
  created() {
    this.initial();
    this.$EventBus.$on("onTotalLottoRefresh", this.initial);
  },
  beforeDestroy() {
    this.$EventBus.$off("onTotalLottoRefresh", this.initial);
  },
  methods: {
    initial() {
      getAvailableLotto("?type_in=LOTTO&type_in=YEEKEE").then(items => {
        this.items = items;
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
