<template>
  <div>
    <v-data-iterator :items="[item]" hide-default-footer>
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="obj in props.items" :key="obj.key" class="py-0">
            <v-card class="my-0">
              <v-card-title class="subheading font-weight-bold">
                <v-row>
                  <v-col class="py-0">
                    <v-icon left color="success">
                      {{ item.icon }}
                    </v-icon>
                    {{ $t(item.name) }}
                  </v-col>
                  <v-col class="py-0 text-right">
                    <v-btn
                      fab
                      x-small
                      color="green"
                      @click="onAddUserBankAccount"
                    >
                      <v-icon small>add</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-divider></v-divider>

              <v-list dense>
                <template v-for="data in obj.data">
                  <v-list-item :key="data.accountCode">
                    <v-list-item-content>
                      <strong
                        >{{
                          $t(data.bank[getLangBankNameKeyFromLocale(locale)])
                        }}
                      </strong>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      {{ data.accountCode }}
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span :class="getClassStatus(data.status)">{{
                        getStatusText(data.status)
                      }}</span>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item :key="data.accountCode">
                    <v-list-item-content>
                      <strong>{{ $t("full-name") }}</strong>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      {{ data.accountName }}
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <div>
                        <v-btn
                          v-if="['REJECTED', 'WAITING'].includes(data.status)"
                          x-small
                          color="green"
                          @click="onApproveClicked(data._id)"
                        >
                          <v-icon small>mdi-check-circle</v-icon>
                        </v-btn>

                        <v-btn
                          v-if="['APPROVED', 'WAITING'].includes(data.status)"
                          x-small
                          color="red"
                          @click="onRejectClicked(data._id)"
                        >
                          <v-icon small>mdi-close-circle</v-icon>
                        </v-btn>
                        <v-btn
                          v-if="data.status !== 'DELETED'"
                          x-small
                          color="grey"
                          @click="onDeleteClicked(data._id)"
                        >
                          <v-icon small>mdi-delete-circle</v-icon>
                        </v-btn>
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item :key="data.accountCode">
                    <v-list-item-content>
                      <strong>{{ $t("action-by") }}</strong>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      {{ data.adminUsername }}
                    </v-list-item-content>
                    <v-list-item-content
                      class="align-end"
                    ></v-list-item-content>
                  </v-list-item>
                  <v-divider :key="data.accountCode" />
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
    <AddUserBankAccountDialog ref="dialogAddUserBankAccount" />
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { addUserBankAccountTransactions } from "@/api/userBankAccountTransaction.js";
import { updateUserBankAccountsById } from "@/api/userBankAccount.js";

import AddUserBankAccountDialog from "@/views/member/components/AddUserBankAccountDialog";

import { getLangBankNameKeyFromLocale } from "@/utils/LocaleUtil";
Object.freeze(getLangBankNameKeyFromLocale);

export default {
  components: {
    AddUserBankAccountDialog
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    getLangBankNameKeyFromLocale,
    receiptName: "",
    receiptURL: "#"
  }),
  computed: {
    locale: get("global/locale")
  },
  methods: {
    getStatusText(status) {
      let key = status.toLowerCase();
      if (key === "waiting") {
        key = "bank_waiting";
      }
      return this.$t(key);
    },
    getClassStatus(status) {
      if (status === "WAITING") {
        return "grey--text";
      } else if (status === "APPROVED") {
        return "green--text";
      } else if (["REJECTED", "DELETED"].includes(status)) {
        return "red--text";
      } else {
        return "";
      }
    },
    onApproveClicked(userBankAccountId) {
      this.$Swal
        .fire({
          title: this.$t("are_you_sure"),
          html: this.$t("are_you_sure_to_approve_the_user_bank_account"),
          icon: "warning",
          showCancelButton: true
        })
        .then(result => {
          if (result.value) {
            const req = {
              userBankAccountId: userBankAccountId,
              status: "APPROVED"
            };
            addUserBankAccountTransactions(req)
              .then(() => {
                this.$Toastr.success(
                  this.$t("approve_user_bank_account_success")
                );
                this.$EventBus.$emit("onMemberRefresh");
              })
              .catch(() => {
                this.$Swal.fire(
                  this.$t("error2"),
                  this.$t("approve_user_bank_account_error"),
                  "error"
                );
              });
          }
        });
    },
    onRejectClicked(userBankAccountId) {
      this.$Swal
        .fire({
          input: "textarea",
          title: this.$t("are_you_sure"),
          html: this.$t("are_you_sure_to_reject_the_user_bank_account"),
          icon: "warning",
          showCancelButton: true,
          inputValidator: value => {
            if (!value) {
              return this.$t("please_fill_reject_reason");
            }
          }
        })
        .then(result => {
          if (result.value) {
            const req = {
              userBankAccountId: userBankAccountId,
              status: "REJECTED",
              remark: result.value
            };
            addUserBankAccountTransactions(req)
              .then(() => {
                this.$Toastr.success(
                  this.$t("reject_user_bank_account_success")
                );
                this.$EventBus.$emit("onMemberRefresh");
              })
              .catch(() => {
                this.$Swal.fire(
                  this.$t("error2"),
                  this.$t("reject_user_bank_account_error"),
                  "error"
                );
              });
          }
        });
    },
    onDeleteClicked(userBankAccountId) {
      this.$Swal
        .fire({
          title: this.$t("are_you_sure"),
          html: this.$t("are_you_sure_to_delete_the_user_bank_account"),
          icon: "warning",
          showCancelButton: true
        })
        .then(result => {
          if (result.value) {
            const req = { status: "DELETED" };
            updateUserBankAccountsById(userBankAccountId, req)
              .then(() => {
                this.$Toastr.success(
                  this.$t("delete_user_bank_account_success")
                );
                this.$EventBus.$emit("onMemberRefresh");
              })
              .catch(() => {
                this.$Swal.fire(
                  this.$t("error2"),
                  this.$t("delete_user_bank_account_error"),
                  "error"
                );
              });
          }
        });
    },
    onAddUserBankAccount() {
      if (this.user) {
        this.$refs.dialogAddUserBankAccount.openDialog(this.user);
      } else {
        this.$Toastr.error(this.$t("no_user_found"));
      }
    }
  }
};
</script>

<style></style>
