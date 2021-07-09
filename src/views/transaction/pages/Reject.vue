<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col class="pb-0">
        <base-material-card class="mb-0">
          <template v-slot:heading>
            <v-row>
              <v-col class="py-0">
                <div class="display-2 font-weight-light">
                  {{ $t("reject-reason") }}
                </div>

                <div class="subtitle-1 font-weight-light">
                  {{ $t("reject_reason_subtitle") }}
                </div></v-col
              >
              <v-col class="py-0 text-right">
                <v-btn
                  fab
                  small
                  :loading="fetching"
                  :disabled="fetching"
                  color="green"
                  class="mr-2"
                  @click="onAddClicked"
                >
                  <v-icon large>mdi-plus-circle</v-icon>
                </v-btn>
                <v-btn
                  fab
                  small
                  :loading="fetching"
                  :disabled="fetching"
                  color="warning"
                  class="mr-2"
                  @click="onEditClicked"
                >
                  <v-icon large>mdi-circle-edit-outline</v-icon>
                </v-btn>
                <v-btn
                  fab
                  small
                  :loading="fetching"
                  :disabled="fetching"
                  color="primary"
                  @click="onRemoveClicked"
                >
                  <v-icon large>mdi-minus-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <div style="height: 76vh;">
            <ag-grid-vue
              :style="showFrom ? 'height: 48%;' : 'height: 100%;'"
              class="ag-theme-alpine pt-2"
              row-selection="single"
              :grid-options="gridOptions"
              :get-row-node-id="getRowNodeId"
              :column-defs="columnDefs"
              :default-col-def="{
                sortable: true,
                resizable: true
              }"
              :row-data="rowData"
              :animate-rows="true"
              :suppress-drag-leave-hides-columns="true"
              :row-drag-managed="false"
              :floating-filter="false"
              @cell-focused="onFocused"
              @grid-ready="onGridReady"
            />
            <v-scale-transition>
              <div v-if="showFrom" class="pt-2">
                <v-card class="my-0" style="height: 52%;">
                  <v-card-title class="subheading font-weight-bold">
                    <v-icon
                      left
                      :color="mode === 'ADD' ? 'success' : 'warning'"
                    >
                      {{
                        mode === "ADD"
                          ? "mdi-plus-circle"
                          : "mdi-circle-edit-outline"
                      }}
                    </v-icon>
                    {{ mode === "ADD" ? $t("add") : $t("edit") }}
                    {{ $t("reject-reason").toLowerCase() }}</v-card-title
                  >
                  <v-divider></v-divider>

                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <strong>{{ $t("status") }}</strong>
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        <v-switch
                          v-model="active"
                          :label="`${$t('status')} ${
                            active ? $t('open') : $t('close')
                          }`"
                        ></v-switch>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <strong>{{ $t("reject-reason") }}</strong>
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        <v-textarea
                          v-model="name"
                          :label="$t('reject-reason')"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <v-row class="px-4">
                    <v-col v-if="mode === 'ADD'" class="pt-0">
                      <v-btn color="success" block @click="onSubmitClicked">
                        <v-icon left>mdi-check-circle</v-icon>
                        <strong>{{ $t("save") }}</strong></v-btn
                      ></v-col
                    >
                    <v-col v-else class="pt-0">
                      <v-btn color="warning" block @click="onSubmitClicked">
                        <v-icon left>mdi-check-circle</v-icon>
                        <strong>{{ $t("edit") }}</strong></v-btn
                      ></v-col
                    >
                    <v-col class="pt-0">
                      <v-btn block @click="onCancelClicked">
                        <v-icon left>mdi-make-circle</v-icon>
                        <strong>{{ $t("cancel") }}</strong></v-btn
                      ></v-col
                    >
                  </v-row>
                </v-card>
              </div>
            </v-scale-transition>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import {
  getRejectReasons,
  addRejectReasons,
  updateRejectReasonsById,
  removeRejectReasonsById
} from "@/api/rejectReason.js";

import { columnDefs } from "@/views/transaction/grid/RejectReasonColumnDefs.js";
Object.freeze(columnDefs);

import RejectReasonStatus from "@/views/transaction/grid/RejectReasonStatus";
import AgGridHeaderI18n from "@/components/AgGridHeaderI18n";

export default {
  name: "Reject",
  components: {
    AgGridVue,
    /* eslint-disable */
    AgGridHeaderI18n,
    RejectReasonStatus
  },
  data: () => ({
    columnDefs,
    rowData: [],
    gridApi: null,
    columnApi: null,

    showFrom: false,
    active: true,
    name: "",
    currentFocused: {},
    mode: "ADD"
  }),
  watch: {
    currentFocused(currentFocused) {
      if (this.mode === "EDIT") {
        this.active = currentFocused.active;
        this.name = currentFocused.name;
      }
    }
  },
  created() {
    this.gridOptions = {};
    this.fetchRejectReasons();
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    onFocused(event) {
      this.gridOptions.api.forEachNode(node => {
        if (event.rowIndex === node.rowIndex) {
          this.currentFocused = node.data;
          return;
        }
      });
    },
    getRowNodeId(data) {
      return data._id;
    },
    onAddClicked() {
      this.mode = "ADD";
      this.showFrom = true;
      this.active = true;
      this.name = "";
    },
    onEditClicked() {
      if (!this.currentFocused._id) {
        this.$Swal.fire(
          this.$t("warning"),
          this.$t("please_select_reject_reason_to_edit"),
          "warning"
        );
        return;
      }

      this.mode = "EDIT";
      this.showFrom = true;
      this.active = this.currentFocused.active;
      this.name = this.currentFocused.name;
    },
    onRemoveClicked() {
      if (!this.currentFocused._id) {
        this.$Swal.fire(
          this.$t("warning"),
          this.$t("please_select_reject_reason_to_edit"),
          "warning"
        );
        return;
      }

      this.$Swal
        .fire({
          title: this.$t("are_you_sure"),
          html: this.$t("are_you_sure_delete_reject_reason"),
          icon: "warning",
          showCancelButton: true
        })
        .then(result => {
          if (result.value) {
            removeRejectReasonsById(this.currentFocused._id)
              .then(() => {
                this.$Toastr.success(this.$t("delete_reject_reason_success"));
                this.fetchRejectReasons();
              })
              .catch(() => {
                this.$Swal.fire(
                  this.$t("error3"),
                  this.$t("delete_reject_reason_error"),
                  "error"
                );
              });
          }
        });
    },
    onSubmitClicked() {
      const req = {
        active: this.active,
        name: this.name
      };

      if (this.mode === "ADD") {
        addRejectReasons(req)
          .then(res => {
            this.fetchRejectReasons();
            this.showFrom = false;
            this.$Toastr.success(this.$t("add_reject_reason_success"));
          })
          .catch(err => {
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("add_reject_reason_error"),
              "error"
            );
          });
      } else if (this.mode === "EDIT") {
        updateRejectReasonsById(this.currentFocused._id, req)
          .then(res => {
            this.fetchRejectReasons();
            this.showFrom = false;
            this.$Toastr.success(this.$t("edit_reject_reason_success"));
          })
          .catch(err => {
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("edit_reject_reason_error"),
              "error"
            );
          });
      }
    },
    onCancelClicked() {
      this.mode = "ADD";
      this.showFrom = false;
      this.active = true;
      this.name = "";
    },
    fetchRejectReasons() {
      getRejectReasons().then(res => {
        this.rowData = res;
      });
    }
  }
};
</script>
