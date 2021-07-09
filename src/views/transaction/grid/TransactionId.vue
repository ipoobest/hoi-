<template>
  <router-link
    v-if="params.data"
    :to="`/transaction/${params.value}`"
    tag="a"
    >{{ params.data.no }}</router-link
  >
</template>
