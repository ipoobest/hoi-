<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("member2") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("member_details") }}
                </div>
              </v-col>
              <v-col class="py-0 text-right">
                <v-btn
                  fab
                  small
                  :loading="fetching"
                  :disabled="fetching"
                  color="green"
                  @click="onRefreshClicked($route.params.id)"
                >
                  <v-icon large>mdi-refresh-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <div class="pt-0">
            <v-row>
              <v-col cols="12" sm="12" class="pt-5 pl-5">
                <a href="#" @click="$router.back()">{{ $t("back") }}</a>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <DetailCard v-if="user" :item="detailItem" :user="user" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <UserBankAccountCard
                  v-if="user"
                  :item="bankItems"
                  :user="user"
                />
              </v-col>
            </v-row>

            <CurrentTransactionTable v-if="user" :user-id="user._id" />
            <PreviousTransactionTable
              v-if="user"
              :user-id="user._id"
              :created-at="new Date()"
              :transaction-id="user._id"
            />
            <OrderTable v-if="user" :user-id="user._id" />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DetailCard from "@/views/member/components/DetailCard";
import UserBankAccountCard from "@/views/member/components/UserBankAccountCard";
import PreviousTransactionTable from "@/views/transaction/components/PreviousTransactionTable";
import CurrentTransactionTable from "@/views/transaction/components/CurrentTransactionTable";
import OrderTable from "@/views/member/components/OrderTable";

import { getUserById } from "@/api/user.js";
import { getUserBankAccounts } from "@/api/userBankAccount.js";

export default {
  components: {
    DetailCard,
    UserBankAccountCard,
    PreviousTransactionTable,
    CurrentTransactionTable,
    OrderTable
  },
  data: () => ({
    user: null,
    userBankAccounts: [],
    detailItem: {
      name: "member_details",
      icon: "mdi-file-table"
    },
    bankItems: {
      name: "user_bank_account_list",
      icon: "mdi-account-check"
    }
  }),
  watch: {
    "$route.params.id": {
      handler(id) {
        if (id) {
          this.onRefreshClicked();
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.$EventBus.$on("onMemberRefresh", this.onRefreshClicked);
  },
  beforeDestroy() {
    this.$EventBus.$off("onMemberRefresh", this.onRefreshClicked);
  },
  methods: {
    onRefreshClicked() {
      getUserById(this.$route.params.id)
        .then(res => {
          this.user = res;
          this.detailItem = {
            ...this.detailItem,
            data: [
              {
                key: "username",
                topic: "username",
                value: res.username
              },
              {
                key: "phone",
                topic: "phone",
                value: res.phone
              },
              {
                key: "parentUsername",
                topic: "parent_member",
                value: res.parentUsername
              },
              {
                key: "type",
                topic: "type",
                value: res.type
              },
              {
                key: "lastIpAddress",
                topic: "last_ip_address",
                value: res.lastIpAddress
              },
              {
                key: "createdIpAddress",
                topic: "first_ip_address",
                value: res.createdIpAddress
              },
              {
                key: "lastInteractedAt",
                topic: "last_interact_at",
                value:
                  (res.lastInteractedAt &&
                    this.$Moment(res.lastInteractedAt).format("L HH:mm:ss")) ||
                  "-"
              },
              {
                key: "lastLoginedAt",
                topic: "last_logedin_date",
                value:
                  (res.lastLoginedAt &&
                    this.$Moment(res.lastLoginedAt).format("L HH:mm:ss")) ||
                  "-"
              },
              {
                key: "createdAt",
                topic: "created_at",
                value:
                  (res.createdAt &&
                    this.$Moment(res.createdAt).format("L HH:mm:ss")) ||
                  "-"
              }
            ]
          };
        })
        .catch(err => err);

      getUserBankAccounts(
        0,
        Number.MAX_SAFE_INTEGER,
        [],
        [],
        "&_sort=createdAt:DESC&userId=" + this.$route.params.id
      )
        .then(res => {
          this.userBankAccounts = res;
          this.bankItems = {
            ...this.bankItems,
            data: res
          };
        })
        .catch(err => err);
    }
  }
};
</script>
