<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">ออนไลน์</div>

            <div class="subtitle-1 font-weight-light">
              รายการรายชื่อสมาชิกออนไลน์ทั้งหมด
            </div>
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
  name: "PlayerOnline",
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
    filterParentUsername: null
  }),
  created() {
    this.worker = setInterval(() => {
      this.onPlayerOnlineRefresh();
    }, 5000);
    this.$EventBus.$on("onPlayerOnlineRefresh", this.onPlayerOnlineRefresh);
  },
  beforeDestroy() {
    if (this.worker) {
      clearInterval(this.worker);
    }
    this.$EventBus.$off("onPlayerOnlineRefresh", this.onPlayerOnlineRefresh);
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

          const startedAt = this.$Moment().subtract(5, "minutes");

          getGridUsers(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            `&lastInteractedAt_gte=${encodeURIComponent(startedAt.format())}`
          )
            .then(data => {
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
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    },
    onPlayerOnlineRefresh() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
    }
  }
};
</script>
