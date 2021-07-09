<template>
  <div v-if="params.data">
    {{ params.value ? $t("verified") : $t("waiting_verify") }}
  </div>
</template>
