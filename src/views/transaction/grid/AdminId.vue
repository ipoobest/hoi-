<template>
  <router-link
    v-if="params.data && params.data.adminCreateId"
    :to="`/admin/${params.data.adminCreateId}`"
    tag="a"
    >{{ params.data.adminCreateUsername }}</router-link
  >
  <router-link
    v-else-if="params.data && params.data.adminId"
    :to="`/admin/${params.data.adminId}`"
    tag="a"
    >{{ params.data.adminUsername }}</router-link
  >
</template>
