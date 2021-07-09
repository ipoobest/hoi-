<template>
  <v-bottom-sheet v-model="sheet" persistent>
    <v-sheet height="80vh">
      <div class="text-right pt-1 pr-1">
        <v-btn icon color="grey" @click="sheet = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="pa-5">
        <OrderItemTable :current-order="order" height="70vh" auto-width />
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import { getOrderLottoById } from "@/api/orderLotto";
import OrderItemTable from "@/views/report/components/OrderItemTable";
export default {
  components: {
    OrderItemTable
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    orderLottoId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    sheet: false,
    order: null
  }),
  watch: {
    value(value) {
      if (value) {
        this.sheet = true;
        this.loadData();
      }
    },
    sheet(value) {
      this.$emit("input", value);
    }
  },
  methods: {
    loadData() {
      getOrderLottoById(this.orderLottoId).then(res => {
        this.order = res;
      });
    }
  }
};
</script>
