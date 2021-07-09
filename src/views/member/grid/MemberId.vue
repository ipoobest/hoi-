<template>
  <router-link
    v-if="params.data"
    :to="`/member/${params.data.userId || params.data.id}`"
    tag="a"
    >{{ params.value }}</router-link
  >
</template>
