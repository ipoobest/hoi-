<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="12">
      <validation-observer ref="observer">
        <v-container class="py-0">
          <v-container fluid>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="16">
                <v-combobox
                  v-model="select"
                  multiple
                  chips
                  clearable
                  :label="$t('username')"
                >
                  <template
                    v-slot:selection="{ attrs, item, parent, selected }"
                  >
                    <v-chip
                      v-bind="attrs"
                      :input-value="selected"
                      close
                      @click:close="parent.selectItem(item)"
                    >
                      <strong>{{ item }}</strong>
                    </v-chip>
                  </template>
                </v-combobox>
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
import { sendSMSSingle } from "@/api/sms";

export default {
  data: () => ({
    select: [],
    message: ""
  }),
  methods: {
    async onSubmitClicked() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }

      if (!this.select || !this.message) {
        //TODO popup กรุณากรอกชื่อผู้ใช้
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("send_sms_error"),
            "error"
          );
        return;
      }

      try {
        let res;
        if (this.select.length === 1) {
          res = await sendSMSSingle({
            username: this.select[0],
            message: this.message
          });
        } else {
          res = await sendSMSMany({
            usernames: this.select,
            message: this.message
          });
        }

        if (res.status === 200) {
          this.$Swal.fire(
            this.$t("info"),
            this.$t("send_sms_success"),
            "success"
          );
          this.select = [];
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
