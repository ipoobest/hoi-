<template>
  <div v-if="params.data">
    {{ $t(params.value.toLowerCase().split(" ").join("_")) }}
  </div>
</template>
