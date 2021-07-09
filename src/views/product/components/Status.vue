<template>
  <div
    v-if="params.data && params.data.status === 'DELETED'"
    :class="textWinLoseClass(params.value)"
  ></div>
  <div v-else-if="params.data" :class="textWinLoseClass(params.value)">
    {{ params.value ? $t("win") : $t("lose") }}
  </div>
</template>

<script>
import { textWinLoseClass } from "@/utils/ClassUtil";
export default {
  data: () => ({
    textWinLoseClass
  })
};
</script>
