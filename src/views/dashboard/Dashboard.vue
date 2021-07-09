<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" class="pl-5 pt-10">
        <div class="float-left">
          <v-btn
            small
            depressed
            color="grey lighten-1"
            class="ma-1"
            :loading="fetching"
            :disabled="previousDays === 7"
            @click="getDashboard(7)"
            >7</v-btn
          >
          <v-btn
            small
            depressed
            color="grey lighten-1"
            class="ma-1"
            :loading="fetching"
            :disabled="previousDays === 6"
            @click="getDashboard(6)"
            >6</v-btn
          >
          <v-btn
            small
            depressed
            color="grey lighten-1"
            class="ma-1"
            :loading="fetching"
            :disabled="previousDays === 5"
            @click="getDashboard(5)"
            >5</v-btn
          >
          <v-btn
            small
            depressed
            color="grey lighten-1"
            class="ma-1"
            :loading="fetching"
            :disabled="previousDays === 4"
            @click="getDashboard(4)"
            >4</v-btn
          >
          <v-btn
            small
            depressed
            color="grey lighten-1"
            class="ma-1"
            :loading="fetching"
            :disabled="previousDays === 3"
            @click="getDashboard(3)"
            >3</v-btn
          >
          <v-btn
            small
            depressed
            color="grey lighten-1"
            class="ma-1"
            :loading="fetching"
            :disabled="previousDays === 2"
            @click="getDashboard(2)"
            >2</v-btn
          >
          <v-btn
            small
            depressed
            color="grey lighten-1"
            class="ma-1"
            :loading="fetching"
            :disabled="previousDays === 1"
            @click="getDashboard(1)"
            >{{ $t("previous_day") }}</v-btn
          >
          <v-btn
            small
            depressed
            color="green"
            class="ma-1"
            :loading="fetching"
            :disabled="previousDays === 0"
            @click="getDashboard(0)"
            >{{ $t("today") }}</v-btn
          >
        </div>
        <div class="float-right">
          <span v-if="previousDays === 0" class="pr-3">{{
            $t("last_updated_at", [endedAt])
          }}</span>
          <v-btn
            fab
            small
            :loading="fetching"
            :disabled="previousDays > 0"
            color="green"
            @click="initial"
          >
            <v-icon large>mdi-refresh-circle</v-icon>
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="light-blue accent-4"
          icon="mdi-account-plus"
          :title="$t('online_users')"
          :value="`${$Numeral(nowOnlineUsers).format('0,0')} / ${$Numeral(
            todayOnlineUsers
          ).format('0,0')}`"
          sub-icon="mdi-clock-outline"
          :sub-text="`${$t('new_users')} ${$Numeral(todayNewUsers).format(
            '0,0'
          )}`"
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="blue darken-4"
          icon="mdi-account-plus"
          :title="$t('all_new_users')"
          :value="$Numeral(todayAllUsers).format('0,0')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_start_to_date', [endedAt]) : $t('no_data')
          "
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="success"
          icon="mdi-bank-plus"
          :title="$t('total_deposit_today')"
          :value="$Numeral(todayDeposit).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="primary"
          icon="mdi-bank-plus"
          :title="$t('total_withdrawal_today')"
          :value="$Numeral(todayWithdrawal).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="yellow darken-1"
          icon="mdi-bank-plus"
          :title="$t('total_adjustment_today')"
          :value="$Numeral(todayAdjustment).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="orange"
          icon="mdi-update"
          :title="$t('total_affiliate_today')"
          :value="$Numeral(todayAffiliate).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="red accent-3"
          icon="mdi-update"
          :title="$t('total_waiting_order_today')"
          :value="$Numeral(todayBetWaiting).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="orange"
          icon="mdi-update"
          :title="$t('profit_loss_today')"
          :value="$Numeral(todayWinLoss).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="light-green lighten-2"
          icon="mdi-delete"
          :title="$t('total_cancelled_order_today')"
          :value="$Numeral(todayBetCancelled).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="info"
          icon="mdi-update"
          :title="$t('total_balance')"
          :value="$Numeral(totalBalance).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="purple darken-1"
          icon="mdi-update"
          :title="$t('total_affiliate_balance')"
          :value="$Numeral(totalAffiliateBalance).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="pink accent-1"
          icon="mdi-update"
          :title="$t('total_credit_balance')"
          :value="$Numeral(totalCreditBalance).format('0,0.00')"
          sub-icon="mdi-clock-outline"
          :sub-text="
            endedAt ? $t('from_to_date', [startedAt, endedAt]) : $t('no_data')
          "
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-card color="success" class="px-5 py-3">
          <template v-slot:heading>
            <div>
              <v-icon large>mdi-cash-100</v-icon> &nbsp;{{
                $t("max-users-deposit")
              }}
            </div>
            <div class="text-caption">
              {{ $t("from_to_date", [startedAt, endedAt]) }}
            </div>
          </template>
          <v-card-text>
            <RankingTable :items="rankingDeposit" style="min-height: 480px" />
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-card color="red" class="px-5 py-3">
          <template v-slot:heading>
            <div>
              <v-icon large>mdi-cash-100</v-icon> &nbsp;{{
                $t("max-users-withdraw")
              }}
            </div>
            <div class="text-caption">
              {{ $t("from_to_date", [startedAt, endedAt]) }}
            </div>
          </template>
          <v-card-text>
            <RankingTable
              :items="rankingWithdrawal"
              style="min-height: 480px"
            />
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-card color="warning" class="px-5 py-3">
          <template v-slot:heading>
            <div>
              <v-icon large>mdi-cash-100</v-icon> &nbsp;{{
                $t("max-users-win")
              }}
            </div>
            <div class="text-caption">
              {{ $t("from_to_date", [startedAt, endedAt]) }}
            </div>
          </template>
          <v-card-text>
            <RankingTable :items="rankingWin" style="min-height: 480px" />
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <base-material-card color="info" class="px-5 py-3">
          <template v-slot:heading>
            <div>
              <v-icon large>mdi-cash-100</v-icon> &nbsp;{{
                $t("max-users-loss")
              }}
            </div>
            <div class="text-caption">
              {{ $t("from_to_date", [startedAt, endedAt]) }}
            </div>
          </template>
          <v-card-text>
            <RankingTable :items="rankingLoss" style="min-height: 480px" />
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDashboard } from "@/api/dashboard";

import RankingTable from "./tables/RankingTable";
export default {
  name: "DashboardDashboard",
  components: {
    RankingTable
  },
  data() {
    return {
      nowOnlineUsers: 0,
      todayOnlineUsers: 0,
      todayNewUsers: 0,
      todayAllUsers: 0,
      todayDeposit: 0,
      todayWithdrawal: 0,
      todayAdjustment: 0,
      todayAffiliate: 0,
      totalBalance: 0,
      totalAffiliateBalance: 0,
      totalCreditBalance: 0,
      todayBetCancelled: 0,
      todayBetWaiting: 0,
      todayWinLoss: 0,
      rankingDeposit: [],
      rankingWithdrawal: [],
      rankingWin: [],
      rankingLoss: [],
      startedAt: null,
      endedAt: null,
      rankingStartedAt: null,
      rankingEndedAt: null,
      fetching: false,
      previousDays: 0
    };
  },
  created() {
    this.initial();
  },
  methods: {
    initial() {
      this.getDashboard(0);
    },
    async getDashboard(previousDays) {
      this.startedAt = null;
      this.endedAt = null;
      this.rankingStartedAt = null;
      this.rankingEndedAt = null;
      this.fetching = true;
      this.previousDays = previousDays;
      try {
        const response = await getDashboard(previousDays);
        this.nowOnlineUsers = response.nowOnlineUsers;
        this.todayOnlineUsers = response.todayOnlineUsers;
        this.todayNewUsers = response.todayNewUsers;
        this.todayAllUsers = response.todayAllUsers;
        this.todayDeposit = response.todayDeposit;
        this.todayWithdrawal = response.todayWithdrawal;
        this.todayAdjustment = response.todayAdjustment;
        this.todayAffiliate = response.todayAffiliate;
        this.totalBalance = response.endTotalBalance;
        this.totalAffiliateBalance = response.endTotalAffiliateBalance;
        this.totalCreditBalance = response.endTotalCreditBalance;
        this.todayBetCancelled = response.todayBetCancelled;
        this.todayBetWaiting = response.todayBetWaiting;
        this.todayWinLoss = response.todayWinLoss;

        if (response.startedAt) {
          this.startedAt = this.$Moment(response.startedAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        if (response.endedAt) {
          this.endedAt = this.$Moment(response.endedAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        this.rankingStartedAt = this.$Moment(response.rankingStartedAt).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.rankingEndedAt = this.$Moment(response.rankingEndedAt).format(
          "YYYY-MM-DD HH:mm:ss"
        );

        this.rankingDeposit = this.$_.map(response.rankingDeposit, o => {
          return {
            name: o.username,
            price: o.totalAmount
          };
        });
        this.rankingWithdrawal = this.$_.map(response.rankingWithdrawal, o => {
          return {
            name: o.username,
            price: o.totalAmount
          };
        });
        this.rankingWin = this.$_.map(response.rankingWin, o => {
          return {
            name: o.username,
            price: o.totalReward
          };
        });
        this.rankingLoss = this.$_.map(response.rankingLoss, o => {
          return {
            name: o.username,
            price: o.totalUserProfit
          };
        });
        this.fetching = false;
      } catch (error) {}
    }
  }
};
</script>
