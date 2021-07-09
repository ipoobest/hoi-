<template>
  <router-link
    v-if="params.data && params.data.userId"
    :to="`/member/${params.data.userId}`"
    tag="a"
    >{{ params.data.username }}</router-link
  >
  <div v-else-if="params.value">{{ params.value }}</div>
</template>
