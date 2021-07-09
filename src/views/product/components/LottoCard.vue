<template>
  <v-col cols="12" sm="6" md="4">
    <v-hover v-slot:default="{ hover }">
      <v-card
        class="my-2"
        outlined
        :raised="['WAITING', 'CLOSED'].includes(status)"
        :class="{ 'card-hover': hover }"
      >
        <v-list-item>
          <v-list-item-content>
            <v-row>
              <v-col class="inside-col" cols="6" sm="12" md="12">
                <v-icon v-if="topicIcon" left>{{ topicIcon }}</v-icon>
                <strong
                  class="text-left"
                  style="font-size: 1rem; line-height: 1.5rem;"
                  :style="topicStyle"
                  >{{ item[getLangNameKeyFromLocale(locale)] }}</strong
                ></v-col
              >
              <v-col class="inside-col" cols="6" sm="12" md="12">
                <div class="text-right">
                  <v-chip small>
                    {{ $t("bet_closed") }} {{ closeTime }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
            <v-divider style="margin: 10px 0;" />
            <v-row>
              <v-col class="inside-col">
                <v-icon :class="textClass">{{ statusIcon }}</v-icon>
              </v-col>
              <v-col class="inside-col text-right" cols="8">
                <strong style="line-height: 1.5rem;" :class="textClass"
                  >{{ $t(statusFormater(status)) }} {{ openTime }}</strong
                >
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-progress-linear
          :active="true"
          :buffer-value="100"
          :striped="true"
          :value="
            ['CLOSED', 'DISABLE', 'DELETED'].includes(status)
              ? 100
              : progressValue
          "
          :color="progressColor"
        />
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer />
          <template v-if="item.status !== 'DELETED'">
            <v-btn
              v-if="!item.finished && !item.calculating"
              class="mr-0"
              color="info"
              small
              @click="onSettingRoundClicked(item._id)"
            >
              <strong>{{ $t("lotto_setting") }}</strong>
            </v-btn>
            <v-btn
              :loading="item.processing || processing"
              class="mr-0"
              color="warning"
              small
              @click="onRollbackClicked(item._id)"
            >
              <strong>{{ $t("rollback") }}</strong>
            </v-btn>
            <v-btn
              v-if="!item.finished"
              class="mr-0"
              color="error"
              :disabled="item.calculating || processing"
              small
              @click="onResultClicked(item._id)"
            >
              <strong>{{ $t("announce") }}</strong>
            </v-btn>
            <v-btn
              v-if="!item.finished"
              class="mr-0"
              color="success"
              :disabled="item.status === 'DISABLE'"
              small
              @click="onOutstandingClicked(item._id)"
            >
              <strong>{{ $t("outstanding_balance") }}</strong>
            </v-btn>
            <v-btn
              v-else
              class="mr-0"
              color="success"
              small
              @click="onWinLossClicked(item._id)"
            >
              <strong>{{ $t("winloss") }}</strong>
            </v-btn>
            <v-btn
              v-if="
                !item.finished && !item.calculating && item.status === 'ENABLE'
              "
              class="mr-0"
              color="red"
              :disabled="item.status === 'DISABLE'"
              :loading="deleting"
              small
              @click="onDeleteClicked(item._id)"
            >
              <strong>{{ $t("delete") }}</strong>
            </v-btn>
          </template>
          <div v-else style="height: 30px;"></div>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import { get } from "vuex-pathify";
import { deleteLotto, rollbackLotto } from "@/api/lotto";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    localTime: {
      type: Object,
      required: true
    },
    systemTime: {
      type: Object,
      required: true
    },
    topicIcon: {
      type: String,
      default: "timer"
    },
    statusIcon: {
      type: String,
      default: "access_time"
    }
  },
  data: () => ({
    getLangNameKeyFromLocale,
    nodeEnv: process.env.NODE_ENV,
    progressValue: 100,
    status: "processing",
    displayStatusIcon: null,
    closeTime: "01:15",
    link: "#",
    deleting: false,
    openTime: null,
    processing: false
  }),
  computed: {
    locale: get("global/locale"),
    topicStyle: function () {
      if (this.status === "DELETED") {
        return "color: grey;";
      } else if (!["WAITING", "DISABLE", "CLOSED"].includes(this.status)) {
        return "color: #EA4650;";
      } else {
        return "";
      }
    },
    textClass: function () {
      if (this.status === "DELETED") {
        return "grey--text";
      } else if (this.status === "CALCULATING") {
        return "warning--text";
      } else if (!["WAITING", "DISABLE", "CLOSED"].includes(this.status)) {
        return "success--text";
      } else {
        return "";
      }
    },
    progressColor: function () {
      if (this.status === "DELETED") {
        return "grey";
      } else if (!["WAITING", "DISABLE", "CLOSED"].includes(this.status)) {
        return "info";
      } else {
        return "black";
      }
    }
  },
  watch: {
    status(value) {
      if (value === "CLOSED") {
        this.displayStatusIcon = "block";
      }
    }
  },
  created() {
    this.initial();
  },
  beforeDestroy() {
    if (this.worker) {
      clearInterval(this.worker);
      this.worker = null;
    }
  },
  methods: {
    initial() {
      if (this.item.status === "ENABLE") {
        this.link = "/bet/" + this.item._id;
        this.displayStatusIcon = this.statusIcon;

        const diffTime = this.$Moment
          .duration(this.$Moment().diff(this.localTime))
          .as("milliseconds");
        const now = this.$Moment(this.systemTime).add(diffTime, "milliseconds");
        const startedAt = this.$Moment(this.item.startedAt);
        const endedAt = this.$Moment(this.item.endedAt);

        if (!this.item.finished) {
          if (now.isBefore(startedAt)) {
            this.status = "WAITING";
          } else if (now.isAfter(endedAt)) {
            this.status = "CLOSED";
          } else {
            if (this.item.calculating) {
              this.status = "CALCULATING";
            } else {
              this.createWorker(now);
            }
          }
        } else {
          this.status = "CLOSED";
        }

        this.closeTime = endedAt.add(1, "seconds").format("HH:mm");
      } else {
        this.status = this.item.status;
      }
    },
    createWorker(now) {
      if (this.worker) {
        clearInterval(worker);
        this.worker = null;
      }
      const startedAt = this.$Moment(this.item.startedAt);
      const endedAt = this.$Moment(this.item.endedAt);
      const startCount = now.subtract(1, "seconds");

      const diff = this.$Moment
        .duration(endedAt.diff(startedAt))
        .as("milliseconds");
      let remainingTime = this.$Moment
        .duration(endedAt.diff(startCount))
        .as("milliseconds");

      this.worker = setInterval(() => {
        remainingTime -= 1000;
        const remainingTimeMoment = this.$Moment.utc(remainingTime);
        let days = Number(remainingTimeMoment.format("D"));
        days--;
        this.status =
          `${days} ${this.$t("remeaning_day")} ` +
          remainingTimeMoment.format(this.$t("remeaning_time"));
        if (diff > remainingTime) {
          this.progressValue = 100 - (remainingTime / diff) * 100;
        } else {
          this.progressValue = 0;
        }
        if (remainingTime <= 0) {
          clearInterval(this.worker);
          this.worker = null;
          this.status = "CLOSED";
          this.item.finished = false;
        }
      }, 1000);
    },
    statusFormater(status) {
      this.openTime = null;
      if (status === "CLOSED") {
        return "bet_closed";
      } else if (status === "WAITING") {
        if (this.$Moment(this.item.startedAt).isAfter(this.$Moment())) {
          return "bet_closed";
        } else {
          this.openTime = this.$Moment(this.item.startedAt).format("HH:mm");
          return "open";
        }
      } else if (status === "DISABLE") {
        return "inactive";
      } else if (status === "DELETED") {
        return "cancelled";
      } else if (status === "CALCULATING") {
        return "processing";
      } else {
        return status;
      }
    },
    onSettingRoundClicked(id) {
      this.$router.push({ path: `/product/lotto/round/setting/${id}` });
    },
    async onResultClicked(id) {
      this.$router.push({ path: `/product/lotto/result/${id}` });
    },
    onOutstandingClicked(id) {
      this.$router.push({ path: `/total/lotto/types/${id}` });
    },
    onWinLossClicked(id) {
      this.$router.push({ path: `/product/lotto/winloss/${id}` });
    },
    async onDeleteClicked(id) {
      let refund = await this.$Swal.fire({
        title: this.$t("please_select_process"),
        html: this.$t("are_you_sure_refund"),
        icon: "warning",
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("not_refund"),
        confirmButtonText: this.$t("yes_refund")
      });
      const result = await this.$Swal.fire({
        title: this.$t("are_you_sure"),
        html: this.$t("are_you_sure_delete"),
        icon: "warning",
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("no"),
        confirmButtonText: this.$t("yes")
      });
      if (result.value) {
        this.deleting = true;
        deleteLotto(id, refund.value)
          .then(() => {
            this.deleting = false;
            this.$EventBus.$emit("onLottoLayoutRefresh");
            this.$Swal.fire(
              this.$t("info"),
              this.$t("deleted_success"),
              "success"
            );
          })
          .catch(error => {
            this.deleting = false;
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("deleted_error"),
              "error"
            );
          });
      }
    },
    async onRollbackClicked(id) {
      const result = await this.$Swal.fire({
        title: this.$t("are_you_sure"),
        html: this.$t("are_you_sure_to_rollback"),
        icon: "warning",
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("no"),
        confirmButtonText: this.$t("yes")
      });
      if (result.value) {
        this.processing = true;
        rollbackLotto(id)
          .then(res => {
            this.processing = false;
            this.$EventBus.$emit("onLottoLayoutRefresh");
            this.$Swal.fire(
              this.$t("info"),
              this.$t("rollback_success"),
              "success"
            );
          })
          .catch(error => {
            this.processing = false;
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("rollback_error"),
              "error"
            );
          });
      }
    }
  }
};
</script>

<style scoped>
div[class^="col"] {
  padding: 12px 6px 0 6px;
}

.inside-col {
  padding: 0 12px;
}

.card-hover {
  border: thin solid #ea4650 !important;
}
</style>
