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

          <CompanyBankAccountDropdownWithValidation
            v-model="comapanyBank"
            :name="$t('to_bank')"
            :label="$t('to_bank')"
            rules="required"
            type="RECEIVE"
          />

          <PaymentChannelDropdownWithValidation
            v-model="channel"
            :label="$t('transfer_channel')"
            :name="$t('transfer_channel')"
            rules="required"
          />
          <v-menu
            v-model="menuDatePicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('date_bank_transfer')"
                rules="required"
              >
                <v-text-field
                  v-model="computedDateFormatted"
                  :label="$t('date_bank_transfer')"
                  persistent-hint
                  prepend-icon="event"
                  readonly
                  hide-details
                  :error="errors.length > 0"
                  v-on="on"
                ></v-text-field>
                <span v-if="errors.length > 0" class="red--text">{{
                  errors[0]
                }}</span>
              </validation-provider>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              :locale="locale"
              @input="menuDatePicker = false"
            ></v-date-picker>
          </v-menu>

          <v-menu
            ref="menuTimePicker"
            v-model="menuTimePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="time"
                :label="$t('time_bank_transfer')"
                prepend-icon="access_time"
                readonly
                hide-details
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuTimePicker"
              v-model="time"
              full-width
              format="24hr"
              @click:minute="$refs.menuTimePicker.save(time)"
            ></v-time-picker>
          </v-menu>
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
            :name="$t('slip')"
            rules="required|image|size:2048"
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
                color="success"
                :loading="loading"
                block
                @click="onSubmitClicked"
                ><v-icon left>playlist_add_check</v-icon
                ><strong>{{ $t("submit_deposit") }}</strong></v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </validation-observer>
    </v-col>
  </v-row>
</template>

<script>
import { get } from "vuex-pathify";
import { withValidation } from "vee-validate";
import UserBankAccountDropdown from "@/components/UserBankAccountDropdown.vue";
import CompanyBankAccountDropdown from "@/components/CompanyBankAccountDropdown.vue";
import PaymentChannelDropdown from "@/components/PaymentChannelDropdown.vue";

const UserBankAccountDropdownWithValidation = withValidation(
  UserBankAccountDropdown
);

const CompanyBankAccountDropdownWithValidation = withValidation(
  CompanyBankAccountDropdown
);
const PaymentChannelDropdownWithValidation = withValidation(
  PaymentChannelDropdown
);

import { addPayment } from "@/api/payment.js";
import { uploadOne } from "@/api/upload.js";
import { getUsers } from "@/api/user.js";

export default {
  components: {
    UserBankAccountDropdownWithValidation,
    CompanyBankAccountDropdownWithValidation,
    PaymentChannelDropdownWithValidation
  },
  data: () => ({
    username: null,
    userId: null,
    userBank: null,

    comapanyBank: null,

    channel: null,
    date: null,
    dateFormatted: null,
    menuDatePicker: false,
    menuTimePicker: false,
    time: null,
    amount: null,
    receipt: null,

    loading: false
  }),
  computed: {
    locale: get("global/locale"),
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },
  watch: {
    date(value) {
      this.dateFormatted = this.formatDate(value);
    }
  },
  created() {
    this.date = this.$Moment().format("YYYY-MM-DD");
    this.time = this.$Moment().format("HH:mm");
    this.dateFormatted = this.formatDate(
      new Date().toISOString().substr(0, 10)
    );
  },
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
          companyBankAccountId: this.comapanyBank._id,
          type: "DEPOSIT",
          amount: this.amount,
          paymentDate: this.$Moment(
            this.date + this.time + ":00.000",
            "YYYY-MM-DDHH:mm:ss.SSS"
          ).toDate()
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

          this.$Toastr.success(this.$t("deposit_success"));
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
              this.$t("deposit_error"),
              "error"
            );
          }
          this.loading = false;
        }
      }
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
};
</script>
