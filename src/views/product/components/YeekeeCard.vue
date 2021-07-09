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
                  :style="
                    !['WAITING', 'CLOSED'].includes(status)
                      ? 'color: #EA4650;'
                      : ''
                  "
                  >{{ $t("round") }} {{ item.round }}</strong
                ></v-col
              >
              <v-col class="inside-col" cols="6" sm="12" md="12">
                <div class="text-right">
                  <v-chip small>{{ $t("bet_closed") }} {{ closeTime }}</v-chip>
                </div>
              </v-col>
            </v-row>
            <v-divider style="margin: 10px 0;" />
            <v-row>
              <v-col class="inside-col">
                <v-icon
                  :class="
                    !['WAITING', 'DISABLE', 'CLOSED'].includes(status)
                      ? 'success--text'
                      : ''
                  "
                  >{{ statusIcon }}</v-icon
                >
              </v-col>
              <v-col class="inside-col text-right" cols="8">
                <strong
                  style="line-height: 1.5rem;"
                  :class="
                    !['WAITING', 'DISABLE', 'CLOSED'].includes(status)
                      ? 'success--text'
                      : ''
                  "
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
          :value="['CLOSED', 'DISABLE'].includes(status) ? 100 : progressValue"
          :color="['CLOSED', 'DISABLE'].includes(status) ? 'black' : 'info'"
        />
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="!item.finished"
            class="mr-0"
            color="info"
            :disabled="item.status === 'DISABLE'"
            small
            @click="onSettingRoundClicked(item._id)"
          >
            <strong>{{ $t("lotto_setting") }}</strong>
          </v-btn>
          <v-btn
            class="mr-0"
            color="warning"
            small
            @click="onCalcRoundClicked(item._id)"
          >
            <strong>{{ $t("calculate") }}</strong>
          </v-btn>
          <v-btn
            v-if="
              (!item.finished && me.role.name === 'Modulator') ||
              (status === 'CLOSED' && !item.finished)
            "
            :loading="calculating"
            :disabled="item.calculating"
            class="mr-0"
            color="error"
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
            <strong>{{ $t("product-winloss") }}</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import { get } from "vuex-pathify";
import { calcYeekeeResultByLottoId } from "@/api/lotto";

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
    openTime: null,
    displayStatusIcon: null,
    closeTime: "01:15",
    link: "#",

    calculating: false
  }),
  computed: {
    locale: get("global/locale"),
    me: get("auth/me")
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
            this.createWorker(now);
          }
        } else {
          this.status = "CLOSED";
        }

        this.closeTime = endedAt.add(1, "seconds").format("HH:mm");
      } else {
        this.status = "DISABLE";
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
        this.status = this.$Moment.utc(remainingTime).format("HH:mm:ss");
        if (diff > remainingTime) {
          this.progressValue = 100 - (remainingTime / diff) * 100;
        } else {
          this.progressValue = 0;
        }
        if (remainingTime <= 0) {
          clearInterval(this.worker);
          this.worker = null;
          this.status = "CLOSED";
          this.item.finished = true;
        }
      }, 1000);
    },
    statusFormater(status) {
      this.openTime = null;
      if (status === "CLOSED") {
        return "bet_closed";
      } else if (status === "WAITING") {
        this.openTime = this.$Moment(this.item.startedAt).format("HH:mm");
        return "open";
      } else if (status === "DISABLE") {
        return "inactive";
      } else {
        return status;
      }
    },
    onSettingRoundClicked(id) {
      this.$router.push({ path: `/product/lotto/round/setting/${id}` });
    },
    onCalcRoundClicked(id) {
      this.$router.push({ path: `/product/lotto/yeekee/${id}` });
    },
    onResultClicked(id) {
      // this.$router.push({ path: `/product/lotto/result/${id}` });
      this.calculating = true;

      this.$Swal
        .fire({
          title: this.$t("warning"),
          html: this.$t("are_you_sure_announce"),
          showCancelButton: true,
          focusCancel: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: this.$t("yes"),
          cancelButtonText: this.$t("no")
        })
        .then(result => {
          if (result.value) {
            calcYeekeeResultByLottoId(id).then(() => {
              if (this.worker) {
                clearInterval(this.worker);
              }
              this.status = "CLOSED";
              this.item.finished = true;
            });
          }
          this.calculating = false;
        });
    },
    onOutstandingClicked(id) {
      this.$router.push({ path: `/total/lotto/types/${id}` });
    },
    onWinLossClicked(id) {
      this.$router.push({ path: `/product/lotto/winloss/${id}` });
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
