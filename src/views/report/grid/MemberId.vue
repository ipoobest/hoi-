<template>
  <router-link
    v-if="params.value"
    :to="`/member/${params.value._id}`"
    tag="a"
    >{{ params.value.username }}</router-link
  >
</template>
