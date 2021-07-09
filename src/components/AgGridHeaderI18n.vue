<template>
  <div
    class="ag-cell-label-container ag-header-cell-sorted-asc"
    @click="onMenuClicked"
  >
    <div class="ag-header-cell-label" role="presentation" unselectable="on">
      <div
        class="ag-header-cell-text"
        :class="{
          'my-right-text':
            params.column.colDef.filter === 'agNumberColumnFilter'
        }"
        role="columnheader"
        unselectable="on"
      >
        {{ $t(params.displayName) }}
      </div>
      <span v-if="ascSort" class="ag-icon ag-icon-asc" unselectable="on"></span>
      <span
        v-else-if="descSort"
        class="ag-icon ag-icon-desc"
        unselectable="on"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AgGridHeaderI18n",
  data: function () {
    return {
      ascSort: null,
      descSort: null,
      noSort: null
    };
  },
  beforeMount() {},
  mounted() {
    this.params.column.addEventListener("sortChanged", this.onSortChanged);
    this.onSortChanged();
  },
  methods: {
    onMenuClicked() {
      if (!this.params.column.colDef.sortable) {
        return;
      }
      let order = "asc";
      if (this.noSort) {
        order = "asc";
      } else if (this.ascSort) {
        order = "desc";
      } else if (this.descSort) {
        order = "";
      }
      this.params.setSort(order, event.shiftKey);
    },
    onSortChanged() {
      this.ascSort = this.descSort = this.noSort = false;
      if (this.params.column.isSortAscending()) {
        this.ascSort = true;
      } else if (this.params.column.isSortDescending()) {
        this.descSort = true;
      } else {
        this.noSort = true;
      }
    }
  }
};
</script>

<style scoped>
.my-right-text {
  margin: 0 0 0 auto;
}
</style>
