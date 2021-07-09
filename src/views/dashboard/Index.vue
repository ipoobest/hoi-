<template>
  <v-app>
    <div class="text-center">
      <v-overlay :value="loading">
        <v-progress-circular
          :width="5"
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
    </div>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />

    <!-- <dashboard-core-settings /> -->
  </v-app>
</template>

<script>
export default {
  name: "DashboardIndex",

  components: {
    DashboardCoreAppBar: () => import("./components/core/AppBar"),
    DashboardCoreDrawer: () => import("./components/core/Drawer"),
    // DashboardCoreSettings: () => import("./components/core/Settings"),
    DashboardCoreView: () => import("./components/core/View")
  },

  data: () => ({
    expandOnHover: false,
    loading: false
  }),
  created() {
    this.$EventBus.$on("showLoading", this.onShowLoading);
    this.$EventBus.$on("hideLoading", this.onHideLoading);
  },
  beforeDestroy() {
    this.$EventBus.$off("showLoading", this.onShowLoading);
    this.$EventBus.$off("hideLoading", this.onHideLoading);
  },
  methods: {
    onShowLoading() {
      this.loading = true;
    },
    onHideLoading() {
      this.loading = false;
    }
  }
};
</script>
