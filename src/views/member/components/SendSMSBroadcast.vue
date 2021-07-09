<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="12">
      <validation-observer ref="observer">
        <v-container class="py-0">
          <v-container fluid>
            <v-row>
              <v-radio-group v-model="type" row>
                <template v-slot:label>
                  <div>{{ $t("sms_memeber_type") }}</div>
                </template>
                <v-radio
                  :label="$t('sms_broadcaset_type_new_member')"
                  value="NEW_MEMBER"
                />
                <v-radio
                  :label="$t('sms_broadcaset_type_interact_member')"
                  value="ACTIVE"
                />
                <v-radio
                  :label="$t('sms_broadcaset_type_not_interact_member')"
                  value="INACTIVE"
                />
                <v-radio
                  :label="$t('sms_broadcaset_type_all_member')"
                  value="ALL_MEMBER"
                />
              </v-radio-group>
            </v-row>
            <v-row>
              <v-radio-group v-model="depositStatus" row>
                <template v-slot:label>
                  <div>{{ $t("sms_deposit_type") }}</div>
                </template>
                <v-radio
                  color="info"
                  :label="$t('sms_deposit_type_deposit')"
                  value="DEPOSIT"
                />
                <v-radio
                  color="info"
                  :label="$t('sms_deposit_type_not_deposit')"
                  value="NOT_DEPOSIT"
                />
                <v-radio
                  color="info"
                  :label="$t('sms_deposit_type_both_deposit')"
                  value="BOTH"
                />
              </v-radio-group>
            </v-row>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="16">
                <v-select
                  v-model="select"
                  v-if="type === 'NEW_MEMBER'"
                  :items="itemsNew"
                  :label="$t('sms_broadcaset_type')"
                  item-text="label"
                  item-value="value"
                  :error-messages="errors"
                  required
                />
                <v-select
                  v-model="select"
                  v-else
                  :items="itemsAll"
                  :label="$t('sms_broadcaset_type')"
                  item-text="label"
                  item-value="value"
                  :error-messages="errors"
                  required
                />
              </v-col>
            </v-row>
          </v-container>

          <validation-provider
            v-slot="{ errors }"
            :name="$t('sms_message')"
            rules="required"
          >
            <v-textarea
              v-model="message"
              :label="$t('sms_message')"
              :error-messages="errors"
            >
              <v-icon slot="prepend">mdi-message-text-outline</v-icon>
            </v-textarea>
          </validation-provider>

          <v-row>
            <v-col class="pb-0">
              <v-btn
                type="submit"
                color="success"
                block
                @click="onSubmitClicked"
                ><v-icon left>playlist_add_check</v-icon
                ><strong>{{ $t("submit_sms") }}</strong></v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </validation-observer>
    </v-col>
  </v-row>
</template>

<script>
import { sendSMSBroadcast } from "@/api/sms";

export default {
  data: () => ({
    select: null,
    message: "",
    itemsNew: [],
    itemsAll: [],
    type: "NEW_MEMBER",
    depositStatus: "DEPOSIT"
  }),
  created() {
    this.onLocaleChanged();

    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  watch: {
    type(type) {
      this.select = null;
    }
  },
  methods: {
    onLocaleChanged() {
      this.itemsNew = [
        {
          label: this.$t("sms_within_1_day"),
          value: 1
        },
        {
          label: this.$t("sms_within_5_days"),
          value: 5
        },
        {
          label: this.$t("sms_within_15_days"),
          value: 15
        }
      ];

      this.itemsAll = [
        {
          label: this.$t("sms_within_1_month"),
          value: 30
        },
        {
          label: this.$t("sms_within_3_months"),
          value: 90
        },
        {
          label: this.$t("sms_within_6_months"),
          value: 180
        }
      ];
    },
    async onSubmitClicked() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }

      try {
        const res = await sendSMSBroadcast({
          type: this.type,
          period: this.select,
          depositStatus: this.depositStatus,
          message: this.message
        });
        if (res.status === 200) {
          this.$Swal.fire(
            this.$t("info"),
            this.$t("send_sms_success"),
            "success"
          );
          this.message = "";
          this.$EventBus.$emit("onSendSmsSuccess");
        } else {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("send_sms_error"),
            "error"
          );
        }
      } catch (error) {
        const code = error.response.data.message.data.statusCode;
        if (code === "INVALID-SMS-LENGTH") {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("sms_error_invalid_length"),
            "error"
          );
        } else if (code === "NOT-PHONE-VERIFIED") {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("sms_error_not_phone_verified"),
            "error"
          );
        } else if (code === "NOT-FOUND-MEMBER") {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("sms_error_not_found_member"),
            "error"
          );
        } else if (code === "NOT-CREDIT") {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("sms_error_not_credit"),
            "error"
          );
        } else {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("send_sms_error"),
            "error"
          );
        }
      }
    }
  }
};
</script>
