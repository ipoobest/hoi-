<template>
  <router-link v-if="params.data" :to="`/member/${params.data._id}`" tag="a">{{
    params.data.username
  }}</router-link>
</template>
