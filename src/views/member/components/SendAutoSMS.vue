<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="12">
      <validation-observer ref="observer">
        <v-container class="py-0">
          <v-row>
            <v-col class="pb-0">
              <v-textarea
                :label="$t('describe_auto_sms')"
                :disabled="true"
                :value="this.$t('describe_auto_sms_content')"
              >
              </v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pb-0">
              <v-textarea
                v-model="currentMessage"
                :label="$t('current_auto_sms')"
                :disabled="true"
              >
              </v-textarea>
            </v-col>
            <v-col class="pb-0">
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
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pb-0">
              <v-btn
                type="submit"
                color="success"
                block
                @click="onUpdateInitAutoSMSTextClicked"
                ><v-icon left>playlist_add_check</v-icon
                ><strong>{{ $t("default_auto_sms") }}</strong></v-btn
              >
            </v-col>
            <v-col class="pb-0">
              <v-btn
                type="submit"
                color="success"
                block
                @click="onUpdateAutoSMSTextClicked"
                ><v-icon left>playlist_add_check</v-icon
                ><strong>{{ $t("update_auto_sms") }}</strong></v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </validation-observer>
    </v-col>
  </v-row>
</template>

<script>
import {
  updateAutoSMSText,
  updateInitAutoSMSText,
  getAutoSMSText
} from "@/api/sms";

export default {
  data: () => ({
    message: "",
    currentMessage: ""
  }),
  created() {
    this.onGetAutoSMSTextClicked();
  },
  methods: {
    async onUpdateAutoSMSTextClicked() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }

      if (!this.message) {
        this.$Swal.fire(
          this.$t("error3"), 
          this.$t("send_sms_error"), 
          "error"
        );
        return;
      }
      try {
        let res = await updateAutoSMSText({
          content: this.message
        });
        if (res.status === 200) {
          this.$Swal.fire(
            this.$t("info"),
            this.$t("send_sms_success"),
            "success"
          );
          this.message = "";
          this.currentMessage = res.data.content;
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
        } else {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("send_sms_error"),
            "error"
          );
        }
      }
    },
    async onUpdateInitAutoSMSTextClicked() {
      try {
        let res = await updateInitAutoSMSText();
        if (res.status === 200) {
          this.$Swal.fire(
            this.$t("info"),
            this.$t("send_sms_success"),
            "success"
          );
          this.currentMessage = res.data.content;
        } else {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("send_sms_error"),
            "error"
          );
        }
      } catch (error) {
        this.$Swal.fire(
          this.$t("error3"), 
          this.$t("send_sms_error"), 
          "error"
        );
      }
    },
    async onGetAutoSMSTextClicked() {
      try {
        let res = await getAutoSMSText();
        if (res.status === 200) {
          this.currentMessage = res.data.content;
        } else {
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("send_sms_error"),
            "error"
          );
        }
      } catch (error) {
        this.$Swal.fire(
          this.$t("error3"), 
          this.$t("send_sms_error"), 
          "error"
        );
      }
    }
  }
};
</script>
