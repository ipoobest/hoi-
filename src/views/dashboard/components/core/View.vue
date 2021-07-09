<template>
  <v-main class="pt-12">
    <vue-page-transition name="fade-in-down">
      <router-view />
    </vue-page-transition>
    <!-- <dashboard-core-footer /> -->
  </v-main>
</template>

<script>
export default {
  name: "DashboardCoreView"
  // components: {
  //   DashboardCoreFooter: () => import("./Footer")
  // }
};
</script>
