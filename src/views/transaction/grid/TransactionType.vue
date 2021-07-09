<template>
  <v-chip :color="colorType(params)">{{
    $t(getIncomeTransactionTypeByKey(params.value))
  }}</v-chip>
</template>

<script>
import { colorType } from "@/views/transaction/grid/Formatter";
import { getIncomeTransactionTypeByKey } from "@/utils/IncomeTransactionTypeFormatter";
export default {
  data: () => ({
    getIncomeTransactionTypeByKey,
    colorType
  })
};
</script>
