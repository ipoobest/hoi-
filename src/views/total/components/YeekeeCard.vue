<template>
  <v-col cols="12" sm="6" md="4">
    <v-hover v-slot:default="{ hover }">
      <v-card class="my-2" outlined :class="{ 'card-hover': hover }">
        <v-list-item>
          <v-list-item-content>
            <v-row>
              <v-col class="inside-col" cols="6" sm="12" md="12">
                <v-icon v-if="topicIcon" left>{{ topicIcon }}</v-icon>
                <strong class="text-left" style="font-size: 1rem;"
                  >{{ $t("round") }} {{ item.round }}</strong
                ></v-col
              >
            </v-row>
            <v-divider style="margin: 10px 0;" />
            <v-row>
              <v-spacer />
              <v-col class="inside-col text-right" cols="8">
                <h1>{{ $Numeral(item.totalAmount).format("0,0.00") }}</h1>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="mr-0"
            color="info"
            small
            :to="`/total/lotto/types/${item._id}`"
          >
            <strong>{{ $t("amount_by_type") }}</strong>
          </v-btn>
          <v-btn
            class="mr-0"
            color="success"
            small
            :to="`/total/lotto/numbers/${item._id}`"
          >
            <strong>{{ $t("amount_by_number") }}</strong>
          </v-btn>
          <v-btn
            class="mr-0"
            color="red"
            small
            :to="`/total/lotto/members/${item._id}`"
          >
            <strong>{{ $t("amount_by_member") }}</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
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
  data: () => ({}),
  created() {},
  beforeDestroy() {},
  methods: {}
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
