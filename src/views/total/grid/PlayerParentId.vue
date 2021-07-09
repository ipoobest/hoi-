<template>
  <router-link
    v-if="params.data && params.data.parentUserId"
    :to="`/member/${params.data.parentUserId}`"
    tag="a"
    >{{ params.data.parentUsername }}</router-link
  >
  <div v-else-if="params.value">{{ params.value }}</div>
</template>
