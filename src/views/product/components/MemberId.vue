<template>
  <router-link
    v-if="params.data"
    :to="`/member/${params.data.userId}`"
    tag="a"
    >{{ params.data.username }}</router-link
  >
</template>
