<template>
  <div v-if="params.data">
    {{ $t(getTransactionStatusByKey(params.value)) }}
  </div>
</template>

<script>
import { getTransactionStatusByKey } from "@/utils/TransactionStatusFormatter";
export default {
  data: () => ({
    getTransactionStatusByKey
  })
};
</script>
