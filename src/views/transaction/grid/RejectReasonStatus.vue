<template>
  <div>{{ $t(status) }}</div>
</template>

<script>
export default {
  data: () => ({
    status: ""
  }),
  created() {
    if (this.params && this.params.value) {
      if (this.params.value) {
        this.status = "active";
      } else {
        this.status = "inactive";
      }
    }
  }
};
</script>
