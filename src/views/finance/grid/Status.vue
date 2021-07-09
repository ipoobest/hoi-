<template>
  <div v-if="params.data">
    {{ params.value ? $t("active") : $t("inactive") }}
  </div>
</template>
