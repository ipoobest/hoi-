<template>
  <v-container fluid>
    <v-row>
      <v-col class="pt-0">
        <YeekeeLayout />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import YeekeeLayout from "@/components/YeekeeBet/YeekeeLayout.vue";

export default {
  name: "Lotto",
  components: {
    YeekeeLayout
  }
};
</script>
