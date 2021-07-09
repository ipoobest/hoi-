<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="6">
      <validation-observer ref="observer">
        <v-container class="py-0">
          <validation-provider
            v-slot="{ errors }"
            :name="$t('username')"
            rules="required"
          >
            <v-text-field
              v-model="username"
              v-validate="'required'"
              :label="$t('username')"
              data-vv-name="username"
              required
              :error-messages="errors"
              @blur="findUserByUsername"
            >
              <v-icon slot="prepend">perm_identity</v-icon>
            </v-text-field>
          </validation-provider>

          <UserBankAccountDropdownWithValidation
            v-model="userBank"
            icon="monetization_on"
            :name="$t('from_bank')"
            :label="$t('from_bank')"
            rules="required"
            :user-id="userId"
          />

          <validation-provider
            v-slot="{ errors }"
            :name="$t('amount')"
            rules="required"
          >
            <v-text-field
              v-model.number="amount"
              :label="$t('amount')"
              type="number"
              :error-messages="errors"
            >
              <v-icon slot="prepend">money</v-icon>
            </v-text-field>
          </validation-provider>

          <v-row>
            <v-col class="pb-0">
              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                block
                @click="onSubmitClicked"
              >
                ><v-icon left>playlist_add_check</v-icon
                ><strong>{{ $t("submit_withdrawal") }}</strong></v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </validation-observer>
    </v-col>
  </v-row>
</template>

<script>
import { mask } from "vue-the-mask";
import { withValidation } from "vee-validate";
import UserBankAccountDropdown from "@/components/UserBankAccountDropdown.vue";

const UserBankAccountDropdownWithValidation = withValidation(
  UserBankAccountDropdown
);

import { addPayment } from "@/api/payment.js";
import { getUsers } from "@/api/user.js";

export default {
  directives: {
    mask
  },
  components: {
    UserBankAccountDropdownWithValidation
  },
  data: () => ({
    username: null,
    userId: null,
    userBank: null,
    amount: null
  }),
  methods: {
    findUserByUsername() {
      if (this.username !== null) {
        const req = `?username=${this.username}`;
        getUsers(req)
          .then(users => {
            if (users.length) {
              this.userId = users[0]._id;
            } else {
              this.username = null;
              this.userId = null;
              this.userBank = null;
              this.$Swal.fire(
                this.$t("error3"),
                this.$t("no_user_found"),
                "error"
              );
            }
          })
          .catch(err => {
            this.username = null;
            this.userId = null;
            this.userBank = null;
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("no_user_found"),
              "error"
            );
          });
      }
    },
    async onSubmitClicked() {
      const result = await this.$refs.observer.validate();
      if (!this.loading && result) {
        this.loading = true;
        let req = {
          username: this.username,
          userBankAccountId: this.userBank._id,
          type: "WITHDRAWAL",
          amount: this.amount,
          paymentDate: this.$Moment().format()
        };

        try {
          await addPayment(req);

          this.$Toastr.success(this.$t("withdraw_success"));
          this.$router.push({ path: "/transaction/instant" });
        } catch (error) {
          if (
            error.response &&
            error.response.data.message === "bank_is_deprecated"
          ) {
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("bank_is_deprecated"),
              "error"
            );
          } else {
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("withdraw_error"),
              "error"
            );
          }
          this.loading = false;
        }
      }
    }
  }
};
</script>
