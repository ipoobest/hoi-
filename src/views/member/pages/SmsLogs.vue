<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("sms_logs") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("sms_logs_subtitle") }}
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
                    <v-card-text v-if="item.text === 'sms_logs'"
                      ><SMSLog
                    /></v-card-text>
                    <v-card-text v-else-if="item.text === 'sms_reports'"
                      ><SMSReport
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
import SMSLog from "@/views/member/components/SMSLog";
import SMSReport from "@/views/member/components/SMSReport";
import { getSMSInfo } from "@/api/sms";

export default {
  components: {
    SMSLog,
    SMSReport
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
        text: "sms_logs",
        class: "green--text"
      },
      {
        text: "sms_reports",
        class: "green--text"
      }
    ],
    tabColor: "green"
  }),
  created() {
    this.fetchSmsInfo();
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

<style>
.filter-dates .v-text-field {
  width: 250px;
}
</style>
