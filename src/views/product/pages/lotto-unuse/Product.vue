<template>
  <v-container fluid tag="section">
    <v-row justify="center">
      <base-material-card>
        <template v-slot:heading>
          <div class="display-2 font-weight-light">
            {{ product.thaiName }}
          </div>

          <div class="subtitle-1 font-weight-light">
            จัดการ{{ product.thaiName }}
          </div>
        </template>

        <template v-if="product.type === 'YEEKEE'">
          <v-container fluid>
            <v-row>
              <v-col class="pt-0">
                <YeekeeLayout />
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-else>
          SSSSS
        </template>
      </base-material-card>
    </v-row>
  </v-container>
</template>

<script>
import { getProductById } from "@/api/productLotto.js";
import YeekeeLayout from "./YeekeeBet/YeekeeLayout";
export default {
  name: "Product",
  components: {
    YeekeeLayout
  },
  data() {
    return {
      product: {}
    };
  },
  created() {
    getProductById(this.$route.params.id).then(product => {
      this.product = product;
    });
  }
};
</script>
