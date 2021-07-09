<template>
  <router-link
    v-if="params.data"
    :to="`/member/bank/${params.value}`"
    tag="a"
    >{{ params.data.no }}</router-link
  >
</template>
