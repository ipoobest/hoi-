<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("overall-report") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("overall_report_subtitle") }}
                </div></v-col
              >
              <v-col class="py-0 text-right">
                <v-btn
                  fab
                  small
                  color="green"
                  class="mr-2"
                  @click="$router.push('/product/lotto/add')"
                >
                  <v-icon large>mdi-plus-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <v-row class="pl-5 pr-5">
            <v-col>
              <div style="width: 200px; display: inline-block;">
                <v-dialog
                  ref="filterDatesDialog"
                  v-model="filterDatesModal"
                  :return-value.sync="filterDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filterDate"
                      :label="$t('date')"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="filterDate"
                    scrollable
                    :locale="locale"
                    :max="$Moment().format('YYYY-MM-DD')"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="filterDatesModal = false"
                      >{{ $t("cancel") }}</v-btn
                    >
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.filterDatesDialog.save(filterDate)"
                      >{{ $t("ok") }}</v-btn
                    >
                  </v-date-picker>
                </v-dialog>
              </div>
              <v-btn
                type="submit"
                color="success"
                class="mx-2 my-auto"
                @click="fetchData"
              >
                <strong>{{ $t("search2") }}</strong>
              </v-btn>
            </v-col>
          </v-row>

          <div class="px-4">
            <v-row>
              <LottoCards :inquery-date="selectedDate" />
            </v-row>
            <v-row>
              <StockCards :inquery-date="selectedDate" />
            </v-row>
            <v-row>
              <SetCards />
            </v-row>
            <v-row>
              <ArenaCards />
            </v-row>            
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get, sync } from "vuex-pathify";
import LottoCards from "@/views/report/components/LottoCards";
import StockCards from "@/views/report/components/StockCards";
import SetCards from "@/views/report/components/SetCards";
import ArenaCards from "@/views/report/components/ArenaCards";

export default {
  components: {
    LottoCards,
    StockCards,
    SetCards,
    ArenaCards
  },
  data: () => ({
    filterDatesModal: false,
    filterDate: null,
    selectedDate: null
  }),
  computed: {
    locale: get("global/locale"),
    overallFilterDate: sync("global/overallFilterDate")
  },
  watch: {
    selectedDate(value) {
      this.overallFilterDate = value;
    }
  },
  created() {
    if (this.overallFilterDate === null) {
      this.filterDate = this.$Moment().format("YYYY-MM-DD");
      this.selectedDate = this.$Moment().format("YYYY-MM-DD");
    } else {
      this.filterDate = this.overallFilterDate;
      this.selectedDate = this.overallFilterDate;
    }
  },
  methods: {
    fetchData() {
      this.selectedDate = this.filterDate;
    }
  }
};
</script>
