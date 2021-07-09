<template>
  <validation-observer ref="observer">
    <v-form @submit.prevent="onSubmit">
      <v-row>
        <v-radio-group
          v-model="filterOption"
          row
          class="pa-0 ma-0 pl-3 filter-dates"
          hide-details
        >
          <span class="pr-2 my-auto">ค้นหาตาม</span>
          <div>
            <v-select
              v-model="type"
              :items="typeItems"
              label="รูปแบบ"
              item-text="label"
              item-value="value"
            >
              <v-icon slot="prepend">{{ icon }}</v-icon>
            </v-select>
          </div>
          <span class="mx-2 my-auto">เลข</span>
          <div>
            <v-text-field v-model="number" label="กรอกเลข" type="text" />
          </div>
          <v-btn type="submit" color="success" class="mx-2 my-auto">
            <strong>ค้นหา</strong>
          </v-btn>
        </v-radio-group>
      </v-row>
      <span class="pr-2 my-auto" style="font-size: 16px; color: #000000;"
        >รวมรายการเลขที่แทง</span
      >
      <ag-grid-vue
        style="height: 300px;"
        class="ag-theme-alpine"
        row-selection="single"
        :column-defs="columnDefs"
        :row-data="rowData"
        :animate-rows="true"
        :suppress-drag-leave-hides-columns="true"
        :row-drag-managed="false"
        :floating-filter="false"
        :pinned-bottom-row-data="pinnedBottomRow"
        @grid-ready="onGridReady"
      />
    </v-form>
  </validation-observer>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { lottoTypes } from "@/utils/LottoTypeFormatter";

import {
  getOrderLottoGroupItem,
  getSumOrderLottoGroupItem
} from "@/api/orderLottoItem.js";

export default {
  components: {
    AgGridVue
  },
  props: {
    currentOrder: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    type: null,
    number: null,
    typeItems: [
      {
        label: "ทั้งหมด",
        value: null
      }
    ],
    columnDefs: [],
    rowData: [],
    gridApi: null,
    columnApi: null,
    pinnedBottomRow: []
  }),
  watch: {
    currentOrder() {
      this.onSubmit();
    }
  },
  created() {
    this.$_.forOwn(lottoTypes, (value, key) => {
      this.typeItems.push({
        label: value,
        value: key
      });
    });
    this.columnDefs = [
      {
        headerName: "รูปแบบ",
        field: "_id.type",
        valueFormatter: params => {
          switch (params.value) {
            case "DIRECT3TOP":
              return "3 ตัวบน";
            case "DIRECT3UNDER":
              return "3 ตัวล่าง";
            case "TOOD3TOP":
              return "3 ตัวโต๊ด";
            case "DIRECT2TOP":
              return "2 ตัวบน";
            case "DIRECT2UNDER":
              return "2 ตัวล่าง";
            case "TOOD2TOP":
              return "2 ตัวโต๊ด";
            case "RUN3TOP":
              return "วิ่งบน";
            case "RUN2TOP":
              return "วิ่งบน";
            case "RUN2UNDER":
              return "วิ่งล่าง";
            case "DIRECT3FRONT":
              return "3 ตัวหน้า";
            default:
              return params.value;
          }
        },
        pinned: "left",
        width: 120,
        filter: "agTextColumnFilter",
        suppressMenu: true
      },
      {
        headerName: "เลข",
        field: "_id.number",
        pinned: "left",
        width: 120,
        filter: "agTextColumnFilter",
        suppressMenu: true
      },
      {
        headerName: "จำนวนบิล",
        field: "totalOrders",
        width: 120,
        valueFormatter: params =>
          params.value && this.$Numeral(params.value).format("0,0"),
        filter: "agNumberColumnFilter",
        cellStyle: {
          display: "flex",
          "justify-content": "flex-end"
        },
        suppressMenu: true
      },
      {
        headerName: "จำนวนไม้",
        field: "totalOrderItems",
        width: 120,
        valueFormatter: params =>
          params.value && this.$Numeral(params.value).format("0,0"),
        filter: "agNumberColumnFilter",
        cellStyle: {
          display: "flex",
          "justify-content": "flex-end"
        },
        suppressMenu: true
      },
      {
        headerName: "ยอดพนัน",
        field: "totalAmount",
        width: 120,
        valueFormatter: params => this.$Numeral(params.value).format("0,0.00"),
        filter: "agNumberColumnFilter",
        cellStyle: {
          display: "flex",
          "justify-content": "flex-end"
        },
        suppressMenu: true
      },
      {
        headerName: "ยอดสุทธิ",
        field: "totalNet",
        width: 120,
        valueFormatter: params => this.$Numeral(params.value).format("0,0.00"),
        cellClass: "info-score",
        filter: "agNumberColumnFilter",
        cellStyle: {
          display: "flex",
          "justify-content": "flex-end"
        },
        suppressMenu: true
      },
      {
        headerName: "ยอดจ่าย",
        field: "totalReward",
        width: 120,
        valueFormatter: params => this.$Numeral(params.value).format("0,0.00"),
        cellClass: "bad-score",
        filter: "agNumberColumnFilter",
        cellStyle: {
          display: "flex",
          "justify-content": "flex-end"
        },
        suppressMenu: true
      },
      {
        headerName: "กำไร",
        field: "totalProfit",
        width: 120,
        valueFormatter: params => this.$Numeral(params.value).format("0,0.00"),
        cellClass: "good-score",
        filter: "agNumberColumnFilter",
        cellStyle: {
          display: "flex",
          "justify-content": "flex-end"
        },
        suppressMenu: true
      }
    ];
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    onSubmit() {
      let type = "";
      if (this.type) {
        type = this.type;
      }
      let number = "";
      if (this.number) {
        number = this.number;
      }
      const filter = `type=${type}&number=${number}`;

      this.gridApi.showLoadingOverlay();
      getOrderLottoGroupItem(this.currentOrder._id, filter)
        .then(res => {
          this.rowData = res;
          this.gridApi.hideOverlay();
        })
        .catch(error => {
          this.gridApi.hideOverlay();
        });
      getSumOrderLottoGroupItem(this.currentOrder._id, filter)
        .then(res => {
          if (res) {
            this.pinnedBottomRow = [
              {
                type: "รวม",
                number: "",
                totalOrders: res.totalOrders,
                totalOrderItems: res.totalOrderItems,
                totalAmount: res.totalAmount,
                totalNet: res.totalNet,
                totalReward: res.totalReward,
                totalProfit: res.totalProfit
              }
            ];
          }
        })
        .catch(err => err);
    }
  }
};
</script>

<style>
.info-score {
  background-color: rgba(179, 212, 255, 0.4);
}
.good-score {
  background-color: rgba(185, 246, 202, 0.4);
}

.bad-score {
  background-color: rgba(255, 128, 171, 0.4);
}
</style>
