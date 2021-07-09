<template>
  <a v-if="params.value" href="javascript:void(0)" @click="onClicked">{{
    params.value
  }}</a>
</template>

<script>
export default {
  methods: {
    onClicked() {
      this.$EventBus.$emit(
        "onLottoNumberItemBottomSheet",
        this.params.data._id.toString()
      );
    }
  }
};
</script>
