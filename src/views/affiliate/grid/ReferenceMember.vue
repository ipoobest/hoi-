<template>
  <router-link
    v-if="params.data"
    :to="`/member/${params.data.referenceUserId}`"
    tag="a"
    >{{ params.value }}</router-link
  >
</template>
