<template>
  <router-link
    v-if="params.value"
    :to="`/report/overall/winloss/${params.data._id}`"
    tag="a"
    >{{ params.value }}</router-link
  >
</template>
