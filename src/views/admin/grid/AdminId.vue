<template>
  <router-link v-if="params.data" :to="`/admin/${params.data._id}`" tag="a">{{
    params.value
  }}</router-link>
</template>
