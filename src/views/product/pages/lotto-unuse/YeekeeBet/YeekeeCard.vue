<template>
  <v-col cols="12" sm="6" md="3">
    <v-hover v-slot:default="{ hover }">
      <router-link :to="link" tag="div">
        <v-card
          class="mx-auto"
          outlined
          :raised="['WAITING', 'CLOSED'].includes(status)"
          style="cursor: pointer;"
          :class="{ 'card-hover': hover }"
          :disabled="['WAITING', 'CLOSED'].includes(status)"
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
                    >รอบที่ {{ item.round }}</strong
                  ></v-col
                >
                <v-col class="inside-col" cols="6" sm="12" md="12">
                  <div class="text-right">
                    <v-chip small> ปิดรับ {{ closeTime }} </v-chip>
                  </div>
                </v-col>
              </v-row>
              <v-divider style="margin: 10px 0;" />
              <v-row>
                <v-col class="inside-col">
                  <v-icon
                    :class="
                      !['WAITING', 'CLOSED'].includes(status)
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
                      !['WAITING', 'CLOSED'].includes(status)
                        ? 'success--text'
                        : ''
                    "
                    >{{ statusFormater(status) }}</strong
                  >
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-progress-linear
            :active="true"
            :buffer-value="100"
            :striped="true"
            :value="status === 'CLOSED' ? 100 : progressValue"
            :color="status === 'CLOSED' ? 'black' : 'info'"
          />
        </v-card>
      </router-link>
    </v-hover>
  </v-col>
</template>

<script>
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
    progressValue: 100,
    status: "กำลังประมวลผล...",
    displayStatusIcon: null,
    closeTime: "01:15",
    link: "#"
  }),
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
      this.link = "/bet/" + this.item._id;
      this.displayStatusIcon = this.statusIcon;

      const diffTime = this.$Moment
        .duration(this.$Moment().diff(this.localTime))
        .as("milliseconds");
      const now = this.$Moment(this.systemTime).add(diffTime, "milliseconds");
      const startedAt = this.$Moment(this.item.startedAt);
      const endedAt = this.$Moment(this.item.endedAt);
      if (now.isBefore(startedAt)) {
        this.status = "WAITING";
      } else if (now.isAfter(endedAt)) {
        this.status = "CLOSED";
      } else {
        this.createWorker(now);
      }
      this.closeTime = endedAt.add(1, "seconds").format("HH:mm");
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
        }
      }, 1000);
    },
    statusFormater(status) {
      if (status === "CLOSED") {
        return "ปิดรับแทง";
      } else if (status === "WAITING") {
        return "เปิดแทง " + this.$Moment(this.item.startedAt).format("HH:mm");
      } else {
        return status;
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
  border-left: thin solid #ea4650 !important;
  border-top: thin solid #ea4650 !important;
  border-right: thin solid #ea4650 !important;
}
</style>
