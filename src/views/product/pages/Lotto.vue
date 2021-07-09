<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("lotto") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("lotto_subtitle") }}
                </div></v-col
              >
              <v-col class="py-0 text-right">
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
import LottoCards from "@/views/product/components/LottoCards";
import StockCards from "@/views/product/components/StockCards";
import SetCards from "@/views/product/components/SetCards";

export default {
  components: {
    LottoCards,
    StockCards,
    SetCards
  }
};
</script>
