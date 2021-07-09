<template>
  <v-avatar tile :color="params.data.color" class="v-chip--label" height="30">
    <div
      v-lazy-container="{ selector: 'img' }"
      style="width: 100%; height: 100%;"
    >
      <img :data-src="bankImage" class="pa-1" /></div
  ></v-avatar>
</template>

<script>
export default {
  data: () => ({
    bankImage: null
  }),
  async created() {
    const logo = await import(`@/assets/banks/${this.params.value}.svg`);
    this.bankImage = logo.default;
  }
};
</script>

<style></style>
