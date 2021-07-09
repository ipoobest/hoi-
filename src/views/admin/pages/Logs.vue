<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("failed-login") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("logedin_failed_subtitle") }}
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
                      <span class="mx-2 my-auto">{{ $t("ip_address") }}</span>
                      <div>
                        <v-text-field
                          v-model="filterIpAddress"
                          :label="$t('ip_address')"
                          type="text"
                        />
                      </div>
                      <v-btn type="submit" color="success" class="mx-2 my-auto">
                        <strong>{{ $t("search2") }}</strong>
                      </v-btn>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <div style="height: 69vh;">
                  <ag-grid-vue
                    style="height: 100%;"
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
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";
import { getGridAdminsLoginFail } from "@/api/user";

import MemberId from "@/views/admin/grid/MemberId";
import { columnDefs } from "@/views/admin/grid/AdminFailLogColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "AdminFailLog",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    MemberId
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    filterUsername: null,
    filterIpAddress: null
  }),
  computed: {
    role: get("auth/me@role")
  },
  created() {
    this.extraReq =
      "&roleName_in=Modulator&roleName_in=Partner&roleName_in=Super%20Admin&roleName_in=Approver";
    if (this.role.name === "Partner") {
      this.extraReq =
        "&roleName_in=Partner&roleName_in=Super%20Admin&roleName_in=Approver";
    }
    this.$EventBus.$on("onAdminFailLogRefresh", this.onAdminFailLogRefresh);
  },
  beforeDestroy() {
    this.$EventBus.$off("onAdminFailLogRefresh", this.onAdminFailLogRefresh);
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

          getGridAdminsLoginFail(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel,
            this.extraReq
          )
            .then(data => {
              let lastRow = -1;
              if (data.length < params.endRow - params.startRow) {
                lastRow =
                  params.endRow -
                  (params.endRow - params.startRow - data.length);
              }
              params.successCallback(data, lastRow);
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
      if (this.filterIpAddress) {
        filter["ipAddress"] = {
          type: "contains",
          filter: this.filterIpAddress
        };
      } else {
        if (filter["ipAddress"]) {
          delete filter["ipAddress"];
        }
      }
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    },
    onAdminFailLogRefresh() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
    }
  }
};
</script>
