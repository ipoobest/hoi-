<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("game") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("game_subtitle") }}
            </div>
          </template>

<!--
          <v-form>
            <v-container class="py-0">
              <v-row>
                ...
              </v-row>
            </v-container>
          </v-form>
-->          

          <div class="px-4">
            <v-row>
              <ArenaCards />
            </v-row>
          </div>

        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArenaCards from "@/views/product/components/ArenaCards";

export default {
  components: {
    ArenaCards
  }  
};
</script>
