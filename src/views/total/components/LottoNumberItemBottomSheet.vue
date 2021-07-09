<template>
  <v-bottom-sheet v-model="sheet" persistent>
    <v-sheet height="80vh">
      <div class="text-right pt-1 pr-1">
        <v-btn icon color="grey" @click="sheet = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="pa-5">
        <OrderItemTable :items="orderItems" height="70vh" auto-width />
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import { getOrderLottoItem } from "@/api/orderLottoItem";
import OrderItemTable from "@/views/total/components/OrderItemTable";
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
    orderItems: []
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
      getOrderLottoItem(this.orderLottoId).then(res => {
        this.orderItems = res;
      });
    }
  }
};
</script>
