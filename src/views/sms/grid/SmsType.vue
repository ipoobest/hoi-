<template>
  <div v-if="params.data">
    {{ $t(getSMSTransactionTypeByKey(params.value)) }}
  </div>
</template>

<script>
import { getSMSTransactionTypeByKey } from "@/utils/SMSTransactionTypeFormatter";
export default {
  data: () => ({
    getSMSTransactionTypeByKey
  })
};
</script>
