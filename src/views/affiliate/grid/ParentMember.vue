<template>
  <router-link
    v-if="params.data"
    :to="`/member/${params.data.parentUserId}`"
    tag="a"
    >{{ params.value }}</router-link
  >
</template>
