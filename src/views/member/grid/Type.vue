<template>
  <div v-if="params.data">{{ $t(getUserTypeByKey(params.value)) }}</div>
</template>

<script>
import { getUserTypeByKey } from "@/utils/UserTypeFormatter";
export default {
  data: () => ({
    getUserTypeByKey
  })
};
</script>
