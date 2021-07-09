<template>
  <div v-if="params.data">
    <v-btn
      v-if="['REJECTED', 'WAITING'].includes(params.data.status)"
      class="mr-2"
      fab
      x-small
      color="green"
      @click="onApproveClicked"
    >
      <v-icon large>mdi-check-circle</v-icon>
    </v-btn>

    <v-btn
      v-if="['APPROVED', 'WAITING'].includes(params.data.status)"
      class="mr-2"
      fab
      x-small
      color="red"
      @click="onRejectClicked"
    >
      <v-icon large>mdi-close-circle</v-icon>
    </v-btn>

    <v-btn
      v-if="params.data.status !== 'DELETED'"
      class="mr-2"
      fab
      x-small
      color="grey"
      @click="onDeleteClicked"
    >
      <v-icon large>mdi-delete-circle</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { addUserBankAccountTransactions } from "@/api/userBankAccountTransaction.js";
import { updateUserBankAccountsById } from "@/api/userBankAccount.js";

export default {
  methods: {
    onApproveClicked() {
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
              userBankAccountId: this.params.value,
              status: "APPROVED"
            };
            addUserBankAccountTransactions(req)
              .then(() => {
                this.$Toastr.success(
                  this.$t("approve_user_bank_account_success")
                );
                this.$EventBus.$emit("onMemberBankRefresh");
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
    onRejectClicked() {
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
              userBankAccountId: this.params.value,
              status: "REJECTED",
              remark: result.value
            };
            addUserBankAccountTransactions(req)
              .then(() => {
                this.$Toastr.success(
                  this.$t("reject_user_bank_account_success")
                );
                this.$EventBus.$emit("onMemberBankRefresh");
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
    onDeleteClicked() {
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
            updateUserBankAccountsById(this.params.value, req)
              .then(() => {
                this.$Toastr.success(
                  this.$t("delete_user_bank_account_success")
                );
                this.$EventBus.$emit("onMemberBankRefresh");
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
    }
  }
};
</script>
