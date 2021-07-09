<template>
  <div v-if="params.value && isItem" :class="cellClass">
    <template v-if="me.role.name === 'Modulator'">
      <a href="javascript:void(0)" tag="a" @click="onClicked">{{
        params.value.number
      }}</a
      ><span :class="textClass"
        >=<label class="black--text">{{
          $Numeral(params.value.totalAmount).format("0,0.00")
        }}</label
        >/{{ $Numeral(params.value.totalReward).format("0,0.00") }}/<label
          class="info--text"
          >{{ params.value.totalOrderItems }}</label
        >
      </span>
    </template>
    <template v-else-if="me.role.name === 'Partner'">
      <span class="error--text">{{ params.value.number }}</span
      ><span :class="textClass"
        >=<label class="black--text">{{
          $Numeral(params.value.totalAmount).format("0,0.00")
        }}</label
        >/{{ $Numeral(params.value.totalReward).format("0,0.00") }}/<label
          class="info--text"
          >{{ params.value.totalOrderItems }}</label
        >
      </span>
    </template>
    <template v-else>
      <span class="error--text">{{ params.value.number }}</span>
      <span>={{ $Numeral(params.value.totalReward).format("0,0.00") }}</span>
    </template>
  </div>
  <div v-else-if="params.value !== null && params.value !== undefined">
    <span :class="textClass">{{
      $Numeral(params.value.value).format("0,0.00")
    }}</span>
  </div>
  <div v-else></div>
</template>

<script>
import { get } from "vuex-pathify";
export default {
  data: () => ({
    isItem: false,
    textClass: "",
    cellClass: ""
  }),
  computed: {
    me: get("auth/me")
  },
  created() {
    if (this.params.data && this.params.value) {
      if (this.params.data.key.startsWith("#")) {
        this.isItem = true;
        if (this.params.value.win) {
          this.textClass = "green--text";
          this.cellClass = "yellow lighten-3";
        }
      } else {
        if (this.params.value.textClass) {
          if (this.params.value.value > 0) {
            this.textClass = "green--text";
          } else if (this.params.value.value < 0) {
            this.textClass = "red--text";
          }
        } else if (this.params.value.lossClass) {
          if (this.params.value.value > 0) {
            this.textClass = "red--text";
          }
        }
      }
    }
  },
  methods: {
    onClicked() {
      this.$EventBus.$emit("onReportLottoNumberItems", {
        number: this.params.value.number,
        type: this.params.value.type,
        totalOrderItems: this.params.value.totalOrderItems
      });
    }
  }
};
</script>
