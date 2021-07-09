<template>
  <div v-if="params.data">
    {{ $t(getProductTypeByKey(params.value)) }}
  </div>
</template>

<script>
import { getProductTypeByKey } from "@/utils/ProductTypeFormatter.js";
export default {
  data: () => ({
    getProductTypeByKey
  })
};
</script>
