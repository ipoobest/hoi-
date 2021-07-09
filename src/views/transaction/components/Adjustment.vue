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

          <validation-provider
            v-slot="{ errors }"
            :name="$t('remark')"
            rules="required"
          >
            <v-textarea
              v-model="remark"
              :label="$t('remark')"
              :error-messages="errors"
            >
              <v-icon slot="prepend">mdi-message-text-outline</v-icon>
            </v-textarea>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            :name="$t('slip')"
            rules="image|size:2048"
          >
            <v-file-input
              v-model="receipt"
              show-size
              :label="$t('slip')"
              accept="image/*"
              :error-messages="errors"
            ></v-file-input
          ></validation-provider>
          <v-divider class="mt-2" />

          <v-row>
            <v-col class="pb-0">
              <v-btn
                type="submit"
                color="warning"
                :loading="loading"
                block
                @click="onSubmitClicked"
              >
                ><v-icon left>playlist_add_check</v-icon
                ><strong>{{ $t("submit_adjustment") }}</strong></v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </validation-observer>
    </v-col>
  </v-row>
</template>

<script>
import { addPayment } from "@/api/payment.js";
import { uploadOne } from "@/api/upload.js";
import { getUsers } from "@/api/user.js";

export default {
  data: () => ({
    username: null,
    userId: null,
    amount: null,
    remark: "",
    receipt: null,

    loading: false
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
          type: "ADJUSTMENT",
          amount: this.amount,
          remark: this.remark,
          paymentDate: this.$Moment().format()
        };

        try {
          const payment = await addPayment(req);

          if (this.receipt) {
            req = {
              files: this.receipt,
              path: "user/payment/receipt",
              refId: payment._id,
              ref: "payment-transaction",
              field: "receipt"
            };
            await uploadOne(req);
          }

          this.$Toastr.success(this.$t("adjustment_success"));
          this.$router.push({ path: "/transaction/instant" });
        } catch (error) {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("adjustment_error"),
            "error"
          );
          this.loading = false;
        }
      }
    }
  }
};
</script>
