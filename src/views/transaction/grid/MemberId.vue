<template>
  <router-link
    v-if="params.data"
    :to="`/member/${params.data && params.data.userId}`"
    tag="a"
    >{{ params.value }}</router-link
  >
</template>
