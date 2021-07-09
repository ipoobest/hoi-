<template>
  <div class="text-center">
    <v-btn
      v-for="num in number.split('')"
      :key="num"
      outlined
      class="pa-0 text-center"
      style="min-width: 1.5rem; margin-right: 4px"
      :style="
        $vuetify.theme.dark
          ? 'border: thin solid rgba(255, 255, 255, 0.12)'
          : 'border: thin solid #ebebeb'
      "
      ><strong class="text-center lotto-number">{{ num }}</strong></v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    number: {
      type: String,
      default: ""
    }
  }
};
</script>
