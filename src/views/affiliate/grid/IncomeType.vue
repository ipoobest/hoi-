<template>
  <div v-if="params.data">
    {{ $t(getIncomeTransactionTypeByKey(params.value)) }}
  </div>
</template>

<script>
import { getIncomeTransactionTypeByKey } from "@/utils/IncomeTransactionTypeFormatter";
export default {
  data: () => ({
    getIncomeTransactionTypeByKey
  })
};
</script>
