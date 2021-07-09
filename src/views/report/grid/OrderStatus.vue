<template>
  <div v-if="params.data">{{ $t(getOrderStatusByKey(params.value)) }}</div>
</template>

<script>
import { getOrderStatusByKey } from "@/utils/OrderStatusFormatter";
export default {
  data: () => ({
    getOrderStatusByKey
  })
};
</script>
