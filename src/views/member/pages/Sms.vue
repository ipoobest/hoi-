<template>
  <v-container id="sms-management" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("sms_notification") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("sms_notification_subtitle") }}
                </div>
              </v-col>

              <v-col class="py-2 text-right">
                <v-row>
                  <v-col class="pa-0 pb-1">
                    <v-chip
                      color="blue accent-3"
                      class="mr-2"
                      style="width: 21rem"
                    >
                      <v-icon left> credit_card </v-icon>
                      <h2>
                        {{ $t("limit_sms_balance") }} :
                        {{ $Numeral(limitSmsBalance).format("0,0.00") }}
                        {{ $t("currency_baht") }}
                      </h2>
                    </v-chip>

                    <v-chip
                      color="blue accent-3"
                      class="mr-2"
                      style="width: 21rem"
                    >
                      <v-icon left> credit_card </v-icon>
                      <h2>
                        {{ $t("limit_otp_balance") }} :
                        {{ $Numeral(limitOtpBalance).format("0,0.00") }}
                        {{ $t("currency_baht") }}
                      </h2>
                    </v-chip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pa-0 pb-1">
                    <v-chip
                      color="primary accent-3"
                      class="mr-2"
                      style="width: 21rem"
                    >
                      <v-icon left> credit_card </v-icon>
                      <h2>
                        {{ $t("sms_balance") }} :
                        {{ $Numeral(smsBalance).format("0,0.00") }}
                        {{ $t("currency_baht") }}
                      </h2>
                    </v-chip>

                    <v-chip
                      color="orange accent-3"
                      class="mr-2"
                      style="width: 21rem"
                    >
                      <v-icon left> credit_card </v-icon>
                      <h2>
                        {{ $t("otp_balance") }} :
                        {{ $Numeral(otpBalance).format("0,0.00") }}
                        {{ $t("currency_baht") }}
                      </h2>
                    </v-chip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pa-0">
                    <v-chip
                      color="cyan darken-2"
                      class="mr-2"
                      style="width: 21rem"
                    >
                      <v-icon left> message </v-icon>
                      <h2>
                        {{ $t("sms_sent") }} : {{ totalSmsSent }}
                        {{ $t("message") }}
                      </h2>
                    </v-chip>

                    <v-chip
                      color="teal darken-1"
                      class="mr-2"
                      style="width: 21rem"
                    >
                      <v-icon left> message </v-icon>
                      <h2>
                        {{ $t("otp_sent") }} : {{ totalOtpSent }}
                        {{ $t("message") }}
                      </h2>
                    </v-chip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>

          <div class="pt-2" style="min-height: 720px">
            <v-card flat>
              <v-card-title class="text-center justify-center py-6">
                <h1
                  class="font-weight-bold display-3 grey--text text--darken-3"
                >
                  {{ $t("sms_notification_subtitle") }}
                </h1>
              </v-card-title>

              <v-tabs v-model="tab" :color="tabColor" grow>
                <v-tab
                  v-for="item in items"
                  :key="item"
                  :active-class="item.class"
                >
                  {{ $t(item.text) }}
                </v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab">
                <v-tab-item v-for="item in items" :key="item">
                  <v-card flat>
                    <v-card-text v-if="item.text === 'send_sms'"
                      ><SendSMS
                    /></v-card-text>
                    <v-card-text v-else-if="item.text === 'send_sms_broadcast'"
                      ><SendSMSBroadcast
                    /></v-card-text>
                    <v-card-text v-else-if="item.text === 'send_auto_sms'"
                      ><SendAutoSMS
                    /></v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SendSMS from "@/views/member/components/SendSMS";
import SendSMSBroadcast from "@/views/member/components/SendSMSBroadcast";
import SendAutoSMS from "@/views/member/components/SendAutoSMS";
import { getSMSInfo } from "@/api/sms";

export default {
  components: {
    SendSMS,
    SendSMSBroadcast,
    SendAutoSMS
  },
  data: () => ({
    tab: null,
    limitSmsBalance: 0,
    smsBalance: 0,
    totalSmsSent: 0,
    limitOtpBalance: 0,
    otpBalance: 0,
    totalOtpSent: 0,
    items: [
      {
        text: "send_sms",
        class: "green--text"
      },
      {
        text: "send_sms_broadcast",
        class: "green--text"
      },
      {
        text: "send_auto_sms",
        class: "green--text"
      }
    ],
    tabColor: "green"
  }),
  created() {
    this.fetchSmsInfo();
    this.$EventBus.$on("onSendSmsSuccess", this.fetchSmsInfo);
  },
  beforeDestroy() {
    this.$EventBus.$off("onSendSmsSuccess", this.fetchSmsInfo);
  },
  methods: {
    fetchSmsInfo() {
      getSMSInfo().then(res => {
        this.smsBalance = res.smsCredit;
        this.otpBalance = res.otpCredit;
        this.limitSmsBalance = res.limitSmsCredit;
        this.limitOtpBalance = res.limitOtpCredit;
        this.totalSmsSent = res.totalSmsSent;
        this.totalOtpSent = res.totalOtpSent;
      });
    }
  }
};
</script>
