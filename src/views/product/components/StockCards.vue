<template>
  <div>
    <v-icon left>language</v-icon>
    <h2 style="display: inline;">{{ $t("lotto_foreign_stock") }}</h2>
    <v-row align="stretch" justify="start">
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="12"
        sm="3"
        md="3"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card outlined raised :class="{ 'card-hover': hover }" class="my-2">
            <v-list-item :to="item.active ? `/product/lotto/${item._id}` : ''">
              <v-list-item-content>
                <v-row align="stretch">
                  <v-col
                    class="inside-col"
                    cols="12"
                    sm="12"
                    md="12"
                    align-self="stretch"
                  >
                    <v-icon v-if="item.iconType === 'normal'" left>{{
                      item.iconName
                    }}</v-icon>
                    <flag
                      v-else-if="item.iconType === 'flag'"
                      :iso="item.iconName"
                      :squared="false"
                      style="margin-right: 0.5rem;"
                    />
                    <strong
                      class="text-left"
                      style="
                        font-size: 1rem;
                        color: #ea4650;
                        line-height: 1.5rem;
                      "
                      >{{ item[getLangNameKeyFromLocale(locale)] }}</strong
                    ></v-col
                  >
                  <v-col class="inside-col" cols="6" sm="12" md="12">
                    <div class="text-right">
                      <v-chip v-if="!item.active" small>
                        {{ $t("inactive") }}</v-chip
                      >
                      <v-chip v-else small>{{ $t("active") }}</v-chip>
                    </div>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer />
              <v-btn
                v-if="['Modulator'].includes(me.role.name)"
                class="mr-0"
                color="info"
                :disabled="!item.active"
                small
                @click="onSettingClicked(item._id)"
              >
                <strong>{{ $t("product_setting") }}</strong>
              </v-btn>
              <v-btn
                v-if="['Modulator'].includes(me.role.name)"
                class="mr-0"
                color="success"
                :disabled="!item.active"
                small
                @click="onProductClicked(item._id)"
              >
                <strong>{{ $t("manage_round") }}</strong>
              </v-btn>
              <v-btn
                v-if="['Modulator'].includes(me.role.name)"
                class="mr-0"
                color="red"
                :disabled="item.status === 'DISABLE'"
                :loading="deleting"
                small
                @click="onDeleteClicked(item._id)"
              >
                <strong>{{ $t("delete") }}</strong>
              </v-btn>
              <v-btn
                v-if="
                  item.status === 'OPEN' && ['Partner'].includes(me.role.name)
                "
                class="mr-0"
                color="info"
                small
                :disabled="!item.active"
                :to="'/product/details/' + item._id"
              >
                <strong>{{ $t("details") }}</strong>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { getProductStock, deleteProductLotto } from "@/api/productLotto";
import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
export default {
  data: () => ({
    getLangNameKeyFromLocale,
    items: []
  }),
  computed: {
    locale: get("global/locale"),
    me: get("auth/me")
  },
  created() {
    this.initial();
  },
  methods: {
    initial() {
      getProductStock().then(items => {
        this.items = items;
      });
    },
    onProductClicked(id) {
      this.$router.push({ path: `/product/lotto/${id}` });
    },
    onSettingClicked(id) {
      this.$router.push({ path: `/product/lotto/setting/${id}` });
    },
    async onDeleteClicked(id) {
      let refund = await this.$Swal.fire({
        title: this.$t("please_select_process"),
        html: this.$t("are_you_sure_refund"),
        icon: "warning",
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("not_refund"),
        confirmButtonText: this.$t("yes_refund")
      });
      const result = await this.$Swal.fire({
        title: this.$t("are_you_sure"),
        html: this.$t("are_you_sure_delete"),
        icon: "warning",
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("no"),
        confirmButtonText: this.$t("yes")
      });
      if (result.value) {
        this.deleting = true;
        deleteProductLotto(id, refund.value)
          .then(() => {
            this.deleting = false;
            this.initial();
            this.$Swal.fire(
              this.$t("info"),
              this.$t("deleted_success"),
              "success"
            );
          })
          .catch(error => {
            this.deleting = false;
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("deleted_error"),
              "error"
            );
          });
      }
    }
  }
};
</script>

<style scoped>
div[class^="col"] {
  padding: 0px 6px 0 6px;
}

.inside-col {
  padding: 0 12px;
}

.card-hover {
  border: thin solid #ea4650 !important;
}
</style>
