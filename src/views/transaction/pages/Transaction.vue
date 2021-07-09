<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("transaction") }} {{ transaction.no }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("transaction_details") }}
                </div>
              </v-col>
              <v-col class="py-0 text-right">
                <v-btn
                  fab
                  small
                  :loading="fetching"
                  :disabled="fetching"
                  color="green"
                  @click="onRefreshClicked"
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
                <DetailCard :item="detailItem" :transaction="transaction" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <DetailCard
                  v-if="
                    ['APPROVED', 'AUTO_APPROVED', 'REJECTED'].includes(
                      transaction.status
                    )
                  "
                  :item="auditItem"
                  :transaction="transaction"
                />
                <ApproveCard v-else :transaction="transaction" />
              </v-col>
            </v-row>

            <CurrentTransactionTable
              :user-id="transaction.user && transaction.user._id"
            />
            <PreviousTransactionTable
              v-if="
                transaction.createdAt &&
                transaction.user &&
                transaction.user._id &&
                transaction._id
              "
              :user-id="transaction.user._id"
              :created-at="transaction.createdAt"
              :transaction-id="transaction._id"
            />
            <OrderTable
              v-if="transaction.user && transaction.user._id"
              :user-id="transaction.user._id"
            />
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DetailCard from "@/views/transaction/components/DetailCard";
import ApproveCard from "@/views/transaction/components/ApproveCard";
import PreviousTransactionTable from "@/views/transaction/components/PreviousTransactionTable";
import CurrentTransactionTable from "@/views/transaction/components/CurrentTransactionTable";
import OrderTable from "@/views/transaction/components/OrderTable";

import { getPaymentById } from "@/api/payment.js";
import { getTransactionChannelByKey } from "@/utils/TransactionChannelFormatter.js";
import { getTransactionTerminalByKey } from "@/utils/TransactionTerminalFormatter.js";
import { bankAccountCodeFormatter } from "@/utils/StringMask.js";
import { getTransactionStatusByKey } from "@/utils/TransactionStatusFormatter";

export default {
  components: {
    DetailCard,
    ApproveCard,
    PreviousTransactionTable,
    CurrentTransactionTable,
    OrderTable
  },
  data: () => ({
    transaction: {},
    detailItem: {
      name: "transaction_details",
      icon: "mdi-file-table"
    },
    auditItem: {
      name: "auditing",
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
    this.$EventBus.$on(
      "onWebSocketPaymentTransaction",
      this.onWebSocketPaymentTransaction
    );
    this.$EventBus.$on("onTransactionRefresh", this.onRefreshClicked);
  },
  beforeDestroy() {
    this.$EventBus.$off(
      "onWebSocketPaymentTransaction",
      this.onWebSocketPaymentTransaction
    );
    this.$EventBus.$off("onTransactionRefresh", this.onRefreshClicked);
  },
  methods: {
    onRefreshClicked() {
      getPaymentById(this.$route.params.id)
        .then(res => {
          this.transaction = res;
          this.detailItem = {
            ...this.detailItem,
            data: [
              {
                key: "no",
                topic: "transaction",
                value: res.no
              },
              {
                key: "username",
                topic: "username",
                value: res.user.username
              },
              {
                key: "parentUsername",
                topic: "parent_member",
                value: res.user.parentUsername
              },
              {
                key: "userBankAccount.accountName",
                topic: "full-name",
                value:
                  (res.userBankAccount && res.userBankAccount.accountName) ||
                  "-"
              },
              {
                key: "type",
                topic: "type",
                value: res.type
              },
              {
                key: "amount",
                topic: "amount",
                value: this.$Numeral(res.amount).format("0,0.00")
              },
              {
                key: "userBankAccount.accountCode",
                topic: "bank_no",
                value:
                  (res.userBankAccount &&
                    bankAccountCodeFormatter.apply(
                      res.userBankAccount.accountCode
                    )) ||
                  "-"
              },
              {
                key: "userBankAccount.bank",
                topic: "bank_name",
                value: res.userBankAccount
              },
              {
                key: "channel",
                topic: "transfer_channel",
                value: getTransactionChannelByKey(res.channel) || "-"
              },
              {
                key: "terminal",
                topic: "channel",
                value: getTransactionTerminalByKey(res.terminal)
              },
              {
                key: "adminCreateUsername",
                topic: "created_by",
                active:
                  res.adminCreateUsername !== undefined &&
                  res.adminCreateUsername !== null,
                value: res.adminCreateUsername
              },
              {
                key: "ipAddress",
                topic: "ip_address",
                value: res.ipAddress
              },
              {
                key: "receipt",
                topic: "slip",
                value: res.receipt || "-"
              },
              {
                key: "paymentDate",
                topic: "payment_date",
                value:
                  (res.paymentDate &&
                    this.$Moment(res.paymentDate).format("L HH:mm:ss")) ||
                  "-"
              },
              {
                key: "remark",
                topic: "remark",
                value: res.remark || "-"
              },
              {
                key: "rejectReason",
                topic: "reject-reason",
                value: res.rejectReason || "-"
              }
            ]
          };

          this.auditItem = {
            ...this.auditItem,
            data: [
              {
                key: "status",
                topic: "status",
                value: this.$t(getTransactionStatusByKey(res.status))
              },
              {
                key: "adminUsername",
                topic: "audited_by",
                value: res.adminUsername || "-"
              },
              {
                key: "updatedAt",
                topic: "audited_time",
                value: this.$Moment(res.updatedAt).format("L HH:mm:ss")
              },
              {
                key: "fee",
                topic: "fee",
                value: this.$Numeral(res.fee).format("0,0.00")
              },
              {
                key: "companyBankName",
                topic: "company-bank-name",
                value: res.companyBankAccount
              },
              {
                key: "companyBankNo",
                topic: "company-bank-no",
                value:
                  (res.companyBankAccount &&
                    bankAccountCodeFormatter.apply(
                      res.companyBankAccount.accountCode
                    )) ||
                  "-"
              },
              {
                key: "rejectReason",
                topic: "reject-reason",
                value: res.rejectReason || "-"
              },
              {
                key: "remark",
                topic: "remark",
                value: res.remark || "-"
              }
            ]
          };
        })
        .catch(err => err);
    },
    onWebSocketPaymentTransaction(trx) {
      if (this.transaction && this.transaction._id === trx._id) {
        this.onRefreshClicked();
      }
    }
  }
};
</script>
