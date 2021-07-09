<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("player-list") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("player_list_subtitle") }}
                </div>
              </v-col>
              <v-col class="py-0 text-right">
                <v-switch
                  v-model="enableWebsocket"
                  class="float-right"
                  :label="$t('open_close_auto_update')"
                ></v-switch>
              </v-col>
            </v-row>
          </template>

          <validation-observer ref="observer">
            <form @submit.prevent="onSubmit">
              <v-container class="pa-0">
                <v-row>
                  <v-col class="py-0">
                    <v-radio-group
                      v-model="filterOption"
                      row
                      class="pa-0 ma-0"
                      hide-details
                    >
                      <span class="mx-2 my-auto">{{ $t("username") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterUsername"
                          :label="$t('username')"
                          type="text"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{
                        $t("first_ip_address")
                      }}</span>
                      <div>
                        <v-text-field
                          v-model="filterCreatedIpAddress"
                          :label="$t('first_ip_address')"
                          type="text"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{
                        $t("last_ip_address")
                      }}</span>
                      <div>
                        <v-text-field
                          v-model="filterIpAddress"
                          :label="$t('last_ip_address')"
                          type="text"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{ $t("phone") }}</span>
                      <div>
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('phone')"
                          rules="numeric"
                        >
                          <v-text-field
                            v-model="filterPhone"
                            :label="$t('phone')"
                            type="text"
                            :error-messages="errors"
                          />
                        </validation-provider>
                      </div>
                      <span class="mx-2 my-auto"></span>
                      <div>
                        <PhoneVerifiedDropdown
                          v-model="filterVerifiedPhone"
                          :label="$t('verify_phone')"
                          style="width: 120px"
                        />
                      </div>
                      <span class="mx-2 my-auto">{{
                        $t("parent_member")
                      }}</span>
                      <div>
                        <v-text-field
                          v-model="filterParentUsername"
                          :label="$t('parent_member')"
                          type="text"
                        />
                      </div>
                      <div style="width: 250px; display: inline-block">
                        <v-dialog
                          ref="filterDatesDialog"
                          v-model="filterDatesModal"
                          :return-value.sync="filterDates"
                          persistent
                          width="320px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="dateRangeText"
                              :label="$t('created_at')"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="filterDates"
                            scrollable
                            range
                            :locale="locale"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="grey"
                              @click="onFilterDatesReset"
                              >{{ $t("clear") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="filterDatesModal = false"
                              >{{ $t("cancel") }}</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="onFilterDatesChange(filterDates)"
                              >{{ $t("ok") }}</v-btn
                            >
                          </v-date-picker>
                        </v-dialog>
                      </div>
                      <v-btn type="submit" color="success" class="mx-2 my-auto">
                        <strong>{{ $t("search2") }}</strong>
                      </v-btn>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <div style="margin-top: 10px; height: 69vh">
                  <ag-grid-vue
                    style="height: 100%"
                    class="ag-theme-alpine"
                    row-model-type="infinite"
                    :column-defs="columnDefs"
                    :default-col-def="{
                      sortable: true,
                      resizable: true
                    }"
                    :animate-rows="true"
                    :suppress-drag-leave-hides-columns="true"
                    :row-drag-managed="false"
                    :floating-filter="false"
                    @grid-ready="onGridReady"
                  />
                </div>
              </v-container>
            </form>
          </validation-observer>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { getGridUsers } from "@/api/user";

import PhoneVerifiedDropdown from "@/components/PhoneVerifiedDropdown";

import MemberId from "@/views/member/grid/MemberId";
import VerifyPhone from "@/views/member/grid/VerifyPhone";
import Type from "@/views/member/grid/Type";
import Block from "@/views/member/grid/Block";
import { columnDefs } from "@/views/member/grid/PlayerColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "Player",
  components: {
    AgGridVue,
    PhoneVerifiedDropdown,
    /* eslint-disable */
    AgGridHeaderI18n,
    MemberId,
    VerifyPhone,
    Type,
    Block
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    filterUsername: null,
    filterCreatedIpAddress: null,
    filterIpAddress: null,
    filterPhone: null,
    filterVerifiedPhone: null,
    filterEmail: null,
    filterParentUsername: null,

    filterDatesModal: false,
    filterDates: [],

    enableWebsocket: true
  }),
  computed: {
    dateRangeText() {
      return this.filterDates.join(" - ");
    }
  },
  created() {
    this.doRefreshGrid = false;
    this.worker = setInterval(() => {
      if (this.doRefreshGrid && this.enableWebsocket) {
        this.doRefreshGrid = false;
        this.onPlayerRefresh();
      }
    }, 5000);
    this.$EventBus.$on("onWebSocketNewUser", this.onWebSocketNewUser);
    this.$EventBus.$on("onPlayerRefresh", this.onPlayerRefresh);
  },
  beforeDestroy() {
    if (this.worker) {
      clearInterval(this.worker);
    }
    this.$EventBus.$off("onWebSocketNewUser", this.onWebSocketNewUser);
    this.$EventBus.$off("onPlayerRefresh", this.onPlayerRefresh);
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default sort
      this.columnApi.getColumn("createdAt").setSort("desc");

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getGridUsers(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel
          )
            .then(data => {
              console.log("data xxx", data);
              let lastRow = -1;
              if (data.length < params.endRow - params.startRow) {
                lastRow =
                  params.endRow -
                  (params.endRow - params.startRow - data.length);
              }
              let start = params.startRow;
              const newData = this.$_.map(data, d => {
                return {
                  no: ++start,
                  ...d
                };
              });
              params.successCallback(newData, lastRow);
              this.gridApi.hideOverlay();
            })
            .catch(error => {
              this.gridApi.hideOverlay();
            });
        }
      });
    },
    async onSubmit() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }
      let filter = this.gridApi.getFilterModel();
      if (!filter) {
        filter = {};
      }
      if (this.filterUsername) {
        filter["username"] = {
          type: "contains",
          filter: this.filterUsername
        };
      } else {
        if (filter["username"]) {
          delete filter["username"];
        }
      }
      if (this.filterCreatedIpAddress) {
        filter["createdIpAddress"] = {
          type: "contains",
          filter: this.filterCreatedIpAddress
        };
      } else {
        if (filter["createdIpAddress"]) {
          delete filter["createdIpAddress"];
        }
      }
      if (this.filterIpAddress) {
        filter["lastIpAddress"] = {
          type: "contains",
          filter: this.filterIpAddress
        };
      } else {
        if (filter["lastIpAddress"]) {
          delete filter["lastIpAddress"];
        }
      }
      if (this.filterPhone) {
        let rawFilterPhone = this.filterPhone;
        if (
          this.filterPhone.length === 10 &&
          this.filterPhone.startsWith("0")
        ) {
          rawFilterPhone = rawFilterPhone.substring(1);
        }
        filter["phone"] = {
          type: "contains",
          filter: rawFilterPhone
        };
      } else {
        if (filter["phone"]) {
          delete filter["phone"];
        }
      }
      if (this.filterVerifiedPhone !== null) {
        filter["phoneVerified"] = {
          type: "equals",
          filter: this.filterVerifiedPhone.toString()
        };
      } else {
        if (filter["phoneVerified"]) {
          delete filter["phoneVerified"];
        }
      }
      if (this.filterEmail) {
        filter["email"] = {
          type: "contains",
          filter: this.filterEmail
        };
      } else {
        if (filter["email"]) {
          delete filter["email"];
        }
      }
      if (this.filterParentUsername) {
        filter["parentUsername"] = {
          type: "contains",
          filter: this.filterParentUsername
        };
      } else {
        if (filter["parentUsername"]) {
          delete filter["parentUsername"];
        }
      }
      if (this.filterDates.length > 0) {
        let filterValue = "";
        if (this.filterDates.length === 2) {
          filterValue +=
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0)
              .format() +
            "," +
            this.$Moment(this.filterDates[1], "YYYY-MM-DD")
              .hours(23)
              .minutes(59)
              .seconds(59)
              .milliseconds(999)
              .format();
        } else {
          filterValue =
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0)
              .format() +
            "," +
            this.$Moment(this.filterDates[0], "YYYY-MM-DD")
              .hours(23)
              .minutes(59)
              .seconds(59)
              .milliseconds(999)
              .format();
        }
        filter["createdAt"] = {
          type: "equals",
          filter: filterValue
        };
      } else {
        if (filter.createdAt) {
          delete filter.createdAt;
        }
      }
      this.gridApi.purgeInfiniteCache();
      // this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    },
    onPlayerRefresh() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
    },
    onWebSocketNewUser(data) {
      this.doRefreshGrid = true;
    },
    onFilterDatesReset() {
      this.filterDatesModal = false;
      this.filterDates = [];
      this.$refs.filterDatesDialog.save([]);
    },
    onFilterDatesChange(filterDates) {
      const newFilterDates = this.$_.sortBy(filterDates);
      this.filterDates = newFilterDates;
      this.$refs.filterDatesDialog.save(newFilterDates);
    }
  }
};
</script>
