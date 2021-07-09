<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("adjustment") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("transaction_actions_subtitle") }}
            </div>
          </template>

          <div class="pt-2" style="min-height: 720px;">
            <v-card flat>
              <v-card-title class="text-center justify-center py-6">
                <h1
                  class="font-weight-bold display-3 grey--text text--darken-3"
                >
                  {{ $t("transaction_actions_subtitle") }}
                </h1>
              </v-card-title>

              <v-tabs
                v-model="tab"
                :color="tabColor"
                grow
                @change="onTabChange"
              >
                <v-tab
                  v-for="item in items"
                  :key="item"
                  :active-class="item.class"
                >
                  {{ $t(item.text) }}
                </v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab">
                <v-tab-item v-for="item in items" :key="item">
                  <v-card flat>
                    <v-card-text v-if="item.text === 'deposit-list'"
                      ><Deposit
                    /></v-card-text>
                    <v-card-text v-else-if="item.text === 'withdrawal-list'"
                      ><Withdraw
                    /></v-card-text>
                    <v-card-text v-else-if="item.text === 'adjustment'"
                      ><Adjustment
                    /></v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Adjustment from "@/views/transaction/components/Adjustment";
import Deposit from "@/views/transaction/components/Deposit";
import Withdraw from "@/views/transaction/components/Withdraw";
export default {
  components: {
    Adjustment,
    Deposit,
    Withdraw
  },
  data: () => ({
    tab: null,
    items: [
      {
        text: "deposit-list",
        class: "green--text"
      },
      {
        text: "withdrawal-list",
        class: "red--text"
      },
      {
        text: "adjustment",
        class: "orange--text"
      }
    ],
    tabColor: "green"
  }),
  methods: {
    onTabChange(tabIndex) {
      if (tabIndex === 0) {
        this.tabColor = "green";
      } else if (tabIndex === 1) {
        this.tabColor = "red";
      } else if (tabIndex === 2) {
        this.tabColor = "orange";
      }
    }
  }
};
</script>
