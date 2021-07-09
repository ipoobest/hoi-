<template>
  <v-col>
    <v-icon left>local_play</v-icon>
    <h2 style="display: inline;">{{ $t("lottos") }}</h2>
    <v-row>
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="12"
        sm="6"
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
                  item.status === 'OPEN' &&
                  item.type === 'YEEKEE' &&
                  ['Partner'].includes(me.role.name)
                "
                class="mr-0"
                color="info"
                small
                :disabled="!item.active"
                :to="'/product/details/yeekee/' + item._id"
              >
                <strong>{{ $t("details") }}</strong>
              </v-btn>
              <v-btn
                v-if="
                  item.status === 'OPEN' &&
                  item.type === 'LOTTO' &&
                  ['Partner'].includes(me.role.name)
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
    <v-dialog v-model="dialogDeleteWarning" persistance width="600">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ $t("are_you_sure") }}
        </v-card-title>
        <v-card-text>
          {{ $t("are_you_sure_refund") }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" @click="onDeleteWarningClicked(true)">
            {{ $t("yes_refund") }}
          </v-btn>
          <v-btn color="red" @click="onDeleteWarningClicked(false)">
            {{ $t("not_refund") }}
          </v-btn>
          <v-btn color="grey" @click="dialogDeleteWarning = false">
            {{ $t("cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import { get } from "vuex-pathify";
import { getProductLottoYeekee, deleteProductLotto } from "@/api/productLotto";
import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  data: () => ({
    getLangNameKeyFromLocale,
    items: [],
    dialogDeleteWarning: false
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
      getProductLottoYeekee().then(items => {
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
      this.dialogDeleteWarning = true;
      this.selectedDeleteId = id;
    },
    async onDeleteWarningClicked(isRefund) {
      this.dialogDeleteWarning = false;
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
        deleteProductLotto(this.selectedDeleteId, isRefund)
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
