<template>
  <div v-if="params.data">
    {{ $t(getCompanyBankAccountTypeByKey(params.value)) }}
  </div>
</template>

<script>
import { getCompanyBankAccountTypeByKey } from "@/utils/CompanyBankAccountFormatter.js";
export default {
  data: () => ({
    getCompanyBankAccountTypeByKey
  })
};
</script>
