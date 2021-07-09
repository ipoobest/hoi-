<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("admin-list") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("admin_list_subtitle") }}
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
                      <span class="mx-2 my-auto">{{ $t("role") }}</span>
                      <div>
                        <AdminRoleDropdownWithValidation
                          v-model="filterRole"
                          :label="$t('role')"
                          rules="required"
                        />
                      </div>
                      <v-btn type="submit" color="success" class="mx-2 my-auto">
                        <strong>{{ $t("search2") }}</strong>
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        type="button"
                        class="mx-2 my-auto"
                        color="primary"
                        dark
                        to="/admin/register"
                      >
                        <v-icon dark left>add</v-icon
                        ><strong>{{ $t("add") }}</strong>
                      </v-btn>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <div style="height: 69vh">
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
import { get } from "vuex-pathify";
import { AgGridVue } from "ag-grid-vue";
import { withValidation } from "vee-validate";
import { getGridAdmins } from "@/api/user";
import Block from "@/views/admin/grid/Block";
import Role from "@/views/admin/grid/Role";
import AdminId from "@/views/admin/grid/AdminId";
import AdminRoleDropdown from "@/components/AdminRoleDropdown";

const AdminRoleDropdownWithValidation = withValidation(AdminRoleDropdown);

import { columnDefs } from "@/views/admin/grid/AdminColumnDefs.js";
Object.freeze(columnDefs);

import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "Admin",
  components: {
    AgGridVue,
    AdminRoleDropdownWithValidation,
    /* eslint-disable */
    AgGridHeaderI18n,
    AdminId,
    Role,
    Block
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    filterUsername: null,
    filterPhone: null,
    filterEmail: null,
    filterRole: null
  }),
  computed: {
    role: get("auth/me@role")
  },
  created() {
    this.$EventBus.$on("onAdminRefresh", this.onAdminRefresh);
  },
  beforeDestroy() {
    this.$EventBus.$off("onAdminRefresh", this.onAdminRefresh);
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // default sort
      this.columnApi.getColumn("createdAt").setSort("desc");

      // default filter
      this.gridApi.setFilterModel({
        "role.name": {
          type: "contains",
          filter: this.filterRole.join(",")
        }
      });

      this.gridApi.setDatasource({
        rowCount: null,
        getRows: params => {
          this.gridApi.showLoadingOverlay();

          getGridAdmins(
            params.startRow,
            params.endRow,
            params.sortModel,
            params.filterModel
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
      if (this.filterPhone) {
        filter["phone"] = {
          type: "contains",
          filter: this.filterPhone
        };
      } else {
        if (filter["phone"]) {
          delete filter["phone"];
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
      if (this.filterRole) {
        filter["role.name"] = {
          type: "contains",
          filter: this.filterRole.join(",")
        };
      } else {
        if (filter["role.name"]) {
          delete filter["filterRole"];
        }
      }
      // this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      this.gridApi.setFilterModel(filter);
    },
    onAdminRefresh() {
      this.gridApi.purgeInfiniteCache();
      this.gridApi.setInfiniteRowCount(0);
      // this.gridApi.refreshInfiniteCache();
    }
  }
};
</script>
